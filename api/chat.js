const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load the knowledge base into memory
let knowledgeBase = '';

try {
  knowledgeBase = fs.readFileSync(path.join(__dirname, 'knowledge_base.txt'), 'utf-8');
} catch (error) {
  console.error('Failed to load knowledge base:', error.message);
}

module.exports = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Combine knowledge base with user prompt
    const augmentedPrompt = `Knowledge Base:\n${knowledgeBase}\n\nUser Prompt:\n${prompt}`;

    const response = await axios.post(
      'https://spaq-oai-instance-01.openai.azure.com/openai/deployments/GPT-4/chat/completions?api-version=2024-06-01',
      {
        messages: [{ role: 'user', content: augmentedPrompt }],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Log the entire response data to check its structure
    console.log(response.data);

    // Correctly access the content based on the response structure
    res.status(200).json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI API' });
  }
};
