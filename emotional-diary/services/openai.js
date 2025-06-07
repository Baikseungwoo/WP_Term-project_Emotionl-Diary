const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze diary content using OpenAI and return emotion + 3 keywords
 * @param {string} content - The user's diary text
 * @returns {Promise<{emotion: string, keywords: string[]}>}
 */
exports.analyzeEmotion = async (content) => {
  const prompt = `
Analyze the following diary entry and extract:
- One emotion from this list: Joy, sadness, anger, bored, fear, disgust, anxiety, calm
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
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = res.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);
    throw new Error("Failed to analyze diary content.");
  }
};