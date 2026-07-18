const express = require("express");
const router = express.Router();
const { chat, generateDescription, analyzeSentiment } = require("../controllers/aiController");

router.post("/chat", chat);
router.post("/generate-description", generateDescription);
router.post("/analyze-sentiment", analyzeSentiment);

module.exports = router;
