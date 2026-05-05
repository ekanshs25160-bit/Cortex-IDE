const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/intent', async (req, res) => {
  try {
    const { code, language, intent } = req.body;

    if (typeof code !== 'string' || !language || !intent) {
      return res.status(400).json({ error: 'Missing required fields: code, language, or intent.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert developer pair programming with a user. The user wants to modify their code based on the following intent:
Intent: ${intent}

Language: ${language}

Original Code:
\`\`\`${language}
${code}
\`\`\`

Please return ONLY the complete modified code. Do not include any markdown formatting like \`\`\`${language} ... \`\`\` around the code or any conversational text. Just the raw code.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let optimizedCode = response.text();

    // Clean up markdown code blocks if the model accidentally included them
    optimizedCode = optimizedCode.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    res.json({ optimizedCode });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'An error occurred while processing the code.' });
  }
});
// Architecture Analysis (For Initial Map)
app.post('/api/ai/analyze-architecture', async (req, res) => {
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
app.post('/api/ai/analyze-map', async (req, res) => {
  const { files } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze these files and identify relationships (who imports/calls what).
  Return a JSON object with a list of 'edges' where each edge has a 'source' (file ID) and 'target' (file ID).
  Files: ${JSON.stringify(files)}`;

  try {
    const result = await model.generateContent(prompt);
    // Clean and parse the AI's JSON output
    let text = result.response.text().replace(/^```json/, '').replace(/```$/, '').trim();
    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: "Failed to map architecture" });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
