const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Feature 1: AI Chatbot ────────────────────────────────────────────────────
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Build full conversation as a text prompt for simplicity & reliability
    let conversationText = `You are ShopBot, a friendly AI shopping assistant for ShopNest e-commerce store. ShopNest sells electronics, clothing, accessories, home goods and more. Keep responses short (2-3 sentences), friendly and helpful. Use emojis occasionally.\n\n`;

    history.forEach((msg) => {
      const role = msg.role === "user" ? "Customer" : "ShopBot";
      conversationText += `${role}: ${msg.content}\n`;
    });

    conversationText += `Customer: ${message}\nShopBot:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: conversationText,
    });

    res.json({ reply: response.text.trim() });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res.status(500).json({ error: "AI service unavailable. Please try again later." });
  }
};

// ─── Feature 2: AI Product Description Generator ─────────────────────────────
const generateDescription = async (req, res) => {
  try {
    const { productName, category, price } = req.body;
    if (!productName) return res.status(400).json({ error: "Product name is required" });

    const prompt = `Write a compelling, SEO-friendly product description for an e-commerce product:
Product Name: ${productName}
Category: ${category || "General"}
Price: ${price ? `₹${price}` : "Not specified"}

Requirements: 2-3 sentences, highlight key benefits, persuasive and professional tone, plain text only (no markdown).
Write only the description, nothing else.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({ description: response.text.trim() });
  } catch (err) {
    console.error("AI Description error:", err.message);
    res.status(500).json({ error: "AI service unavailable. Please try again later." });
  }
};

// ─── Feature 3: Sentiment Analysis ───────────────────────────────────────────
const analyzeSentiment = async (req, res) => {
  try {
    const { review } = req.body;
    if (!review) return res.status(400).json({ error: "Review text is required" });

    const prompt = `Analyze the sentiment of this product review. Respond with ONLY one word: "Positive", "Neutral", or "Negative".

Review: "${review}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const sentiment = response.text.trim();
    let normalized = "Neutral";
    if (sentiment.toLowerCase().includes("positive")) normalized = "Positive";
    else if (sentiment.toLowerCase().includes("negative")) normalized = "Negative";

    res.json({ sentiment: normalized });
  } catch (err) {
    console.error("AI Sentiment error:", err.message);
    res.status(500).json({ error: "AI service unavailable. Please try again later." });
  }
};

module.exports = { chat, generateDescription, analyzeSentiment };
