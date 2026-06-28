const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Create an HTTP server from the Express app instance
const server = http.createServer(app);

// Attach WebSocket server specifically for terminal communication
const wss = new WebSocket.Server({ server, path: '/socket/terminal' });

const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash';

// A helper mapping extension types to execution blueprints
const getExecutionCommand = (filename, filePath) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'py':
      return `python3 ${filePath}`;
    case 'js':
      return `node ${filePath}`;
    case 'cpp':
      return `g++ ${filePath} -o ${filePath}.out && ./${filePath}.out`;
    case 'java':
      return `java ${filePath}`;
    default:
      return null;
  }
};

wss.on('connection', (ws) => {
  console.log('New Terminal session active over WebSocket.');

  // Spawn a real OS process channel on the hosting server
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: require('path').join(process.cwd(), '..'), // Boots up context in the root Cortex IDE directory
    env: process.env
  });

  // Push runtime stdout data string fragments down to client's canvas view
  ptyProcess.onData((data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data }));
      
      // Smart Error Debugging: Check for compilation or runtime errors
      const lowerData = data.toLowerCase();
      if (lowerData.includes('error') || lowerData.includes('exception')) {
        // Asynchronously query Memori for historical fixes
        fetch('http://127.0.0.1:8000/api/memory/retrieve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intent: `How to fix this error: ${data}`, active_code: "", filename: "" })
        })
        .then(res => res.json())
        .then(memoriData => {
          if (memoriData && memoriData.context && memoriData.context !== "[]") {
            ws.send(JSON.stringify({ 
              type: 'ai_error_suggestion', 
              data: `Memori Suggestion: ${memoriData.context}` 
            }));
          }
        })
        .catch(err => console.error("Memori error retrieve failed:", err));
      }
    }
  });

  // Handle interactions sent upwards by user keystrokes
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'input') {
        ptyProcess.write(parsed.data);
      } else if (parsed.type === 'resize') {
        ptyProcess.resize(parsed.cols, parsed.rows);
      } else if (parsed.type === 'run_command') {
        const filePath = path.join(require('path').join(process.cwd(), '..'), parsed.filename);
        if (parsed.content !== undefined) {
          try {
            fs.writeFileSync(filePath, parsed.content);
          } catch (writeErr) {
            console.error('Failed to write temporary file:', writeErr);
          }
        }
        
        const cmd = getExecutionCommand(parsed.filename, parsed.filename);
        if (cmd) {
          ptyProcess.write(cmd + '\r');
        } else {
          ptyProcess.write(`echo "Cannot execute ${parsed.filename}: Unknown extension"\r`);
        }
      }
    } catch (err) {
      console.error('Error processing socket stream command frame:', err);
    }
  });

  ws.on('close', () => {
    console.log('Terminal tab connection broken. Cleaning PTY thread process context.');
    ptyProcess.kill();
  });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/ai/intent", async (req, res) => {
  try {
    const { code, filename, intent } = req.body;

    if (typeof code !== "string" || !filename || !intent) {
      return res
        .status(400)
        .json({ error: "Missing required fields: code, language, or intent." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Fetch RAG Context from Memori Engine
    let memoryContext = "";
    try {
      const memoriRes = await fetch("http://127.0.0.1:8000/api/memory/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, active_code: code, filename })
      });
      const memoriData = await memoriRes.json();
      if (memoriData.context && memoriData.context !== "[]") {
        memoryContext = `\nContext from similar historical tasks:\n${memoriData.context}\n`;
      }
    } catch (err) {
      console.error("Failed to retrieve context from Memori:", err);
    }

    const prompt = `You are an expert developer pair programming with a user. The user wants to modify their code based on the following intent:
Intent: ${intent}
${memoryContext}
Language: ${filename}

Original Code:
\`\`\`${filename}
${code}
\`\`\`

Please return ONLY the complete modified code. Do not include any markdown formatting like \`\`\`${language} ... \`\`\` around the code or any conversational text. Just the raw code.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let optimizedCode = response.text();

    // Clean up markdown code blocks if the model accidentally included them
    optimizedCode = optimizedCode
      .replace(/^```[a-zA-Z]*\n?/, "")
      .replace(/```$/, "")
      .trim();

    // 2. Save the decision permanently to Memori
    try {
      await fetch("http://127.0.0.1:8000/api/memory/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, resulting_code: optimizedCode, filename })
      });
    } catch (err) {
      console.error("Failed to save decision to Memori:", err);
    }

    res.json({ optimizedCode });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the code." });
  }
});
// Architecture Analysis (For Initial Map)
app.post("/api/ai/analyze-architecture", async (req, res) => {
  const { files } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze these files and identify how they are connected (imports/exports). 
  Return ONLY a JSON object with two arrays: 'nodes' and 'edges' formatted for React Flow.
  Files: ${JSON.stringify(files)}`;

  try {
    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    res.status(500).json({ error: "Architecture analysis failed" });
  }
});
// Map Builder (For Dynamic Map)
app.post("/api/ai/analyze-map", async (req, res) => {
  const { files } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze these files and identify relationships (who imports/calls what).
  Return a JSON object with a list of 'edges' where each edge has a 'source' (file ID) and 'target' (file ID).
  Files: ${JSON.stringify(files)}`;

  try {
    const result = await model.generateContent(prompt);
    // Clean and parse the AI's JSON output
    let text = result.response
      .text()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: "Failed to map architecture" });
  }
});

// CRITICAL: Change app.listen to server.listen so both HTTP routes and WebSockets coexist
server.listen(port, () => {
  console.log(`Cortex Core Orchestrator running with Native PTY on Port ${port}`);
});
