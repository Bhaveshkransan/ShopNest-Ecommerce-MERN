const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ─── Feature 1: AI Chatbot ────────────────────────────────────────────────────
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const systemContext = `You are ShopBot, a friendly and helpful AI shopping assistant for ShopNest, an online e-commerce store.
    
    ShopNest sells a wide variety of products including electronics, clothing, accessories, home goods, and more.
    
    Your job is to:
    - Help users find products they are looking for
    - Answer questions about orders, shipping, and returns
    - Give product recommendations
    - Be friendly, concise, and helpful
    - If asked about specific product availability or prices, tell the user to browse the store
    
    Keep responses short (2-3 sentences max) and conversational. Use emojis occasionally to be friendly.`;

    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemContext }] },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I'm ShopBot, ready to help ShopNest customers find what they need.",
            },
          ],
        },
        ...formattedHistory,
      ],
    });

    const result = await chatSession.sendMessage(message);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res
      .status(500)
      .json({ error: "AI service unavailable. Please try again later." });
  }
};

// ─── Feature 2: AI Product Description Generator ─────────────────────────────
const generateDescription = async (req, res) => {
  try {
    const { productName, category, price } = req.body;
    if (!productName)
      return res.status(400).json({ error: "Product name is required" });

    const prompt = `Write a compelling, SEO-friendly product description for an e-commerce product with the following details:
    - Product Name: ${productName}
    - Category: ${category || "General"}
    - Price: ${price ? `₹${price}` : "Not specified"}
    
    Requirements:
    - 2-3 sentences max
    - Highlight key benefits and features
    - Use persuasive language
    - Sound professional and appealing
    - Do NOT use markdown, just plain text
    
    Write only the description, nothing else.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    res.json({ description });
  } catch (err) {
    console.error("AI Description error:", err.message);
    res
      .status(500)
      .json({ error: "AI service unavailable. Please try again later." });
  }
};

// ─── Feature 3: Sentiment Analysis ───────────────────────────────────────────
const analyzeSentiment = async (req, res) => {
  try {
    const { review } = req.body;
    if (!review) return res.status(400).json({ error: "Review text is required" });

    const prompt = `Analyze the sentiment of this product review and respond with ONLY one word: "Positive", "Neutral", or "Negative".
    
    Review: "${review}"
    
    Respond with only one word.`;

    const result = await model.generateContent(prompt);
    const sentiment = result.response.text().trim();

    // Normalize response
    let normalized = "Neutral";
    if (sentiment.toLowerCase().includes("positive")) normalized = "Positive";
    else if (sentiment.toLowerCase().includes("negative"))
      normalized = "Negative";

    res.json({ sentiment: normalized });
  } catch (err) {
    console.error("AI Sentiment error:", err.message);
    res
      .status(500)
      .json({ error: "AI service unavailable. Please try again later." });
  }
};

module.exports = { chat, generateDescription, analyzeSentiment };
