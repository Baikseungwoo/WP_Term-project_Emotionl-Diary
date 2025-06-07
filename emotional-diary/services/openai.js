const { Configuration, OpenAIApi } = require("openai");

// Load API key from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Analyze diary content using OpenAI and return emotion + 3 keywords
 * @param {string} content - The user's diary text
 * @returns {Promise<{emotion: string, keywords: string[]}>}
 */
exports.analyzeEmotion = async (content) => {
  const prompt = `
Analyze the following diary entry and extract:
- One emotion from this list: Joy, sadness, anger, bored, fear, disguest, anxiety, calm
- Three representative keywords

Return ONLY JSON in this format:
{
  "emotion": "emotion_value",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Diary:
${content}
`;

  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = res.data.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze diary content with OpenAI.");
  }
};
