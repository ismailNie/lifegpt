   const axios = require('axios');

   module.exports = async (req, res) => {
     const { prompt } = req.body;

     if (!prompt) {
       return res.status(400).json({ error: 'Prompt is required' });
     }

     try {
       const response = await axios.post(
         'https://spaq-oai-instance-01.openai.azure.com/openai/deployments/GPT-4/chat/completions?api-version=2024-06-01',
         {
           prompt,
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

       res.status(200).json({ reply: response.data.choices[0].text });
     } catch (error) {
       console.error(error.response ? error.response.data : error.message);
       res.status(500).json({ error: 'Failed to fetch response from OpenAI API' });
     }
   };
