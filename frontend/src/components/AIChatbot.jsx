import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "👋 Hi! I'm ShopBot, your AI shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Build history excluding the initial greeting
      const history = updatedMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply || data.error || "Sorry, I couldn't understand that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What products do you have?",
    "How do I track my order?",
    "What's your return policy?",
  ];

  return (
    <div className="chatbot-wrapper">
      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h4>ShopBot AI</h4>
                <span className="chatbot-status">● Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.role === "model" && <span className="bot-icon">🤖</span>}
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message bot">
                <span className="bot-icon">🤖</span>
                <div className="message-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {/* Suggested questions (only shown initially) */}
            {messages.length === 1 && (
              <div className="chatbot-suggestions">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="suggestion-chip"
                    onClick={() => {
                      setInput(q);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="send-btn"
            >
              ➤
            </button>
          </div>
          <p className="chatbot-powered">⚡ Powered by Gemini AI</p>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chatbot-fab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Chat"
      >
        {isOpen ? "✕" : "🤖"}
        {!isOpen && <span className="fab-label">Ask AI</span>}
      </button>
    </div>
  );
};

export default AIChatbot;
