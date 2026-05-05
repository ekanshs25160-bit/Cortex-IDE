const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
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

app.post('/api/ai/analyze-architecture', async (req, res) => {
  const { files } = req.body; // The entire array of file objects
  
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
