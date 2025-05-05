import React, { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gán conversationId nếu chưa có
    if (!sessionStorage.getItem("conversationId")) {
      sessionStorage.setItem("conversationId", "conv_" + Date.now());
    }
  }, []);

  useEffect(() => {
    // Cuộn đến tin nhắn cuối cùng
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleIconClick = () => {
    setIsOpen(!isOpen);

    const hasGreeted = sessionStorage.getItem("hasGreeted");
    if (!hasGreeted) {
      displayMessage(
        "Xin chào! Tôi là trợ lý nha khoa của phòng khám N2CDentCare. Tôi có thể tư vấn về các dịch vụ nha khoa và giúp bạn đặt lịch hẹn. Bạn cần hỗ trợ vấn đề gì?",
        "ai"
      );
      sessionStorage.setItem("hasGreeted", "true");
    }
  };

  const displayMessage = (text: string, sender: "user" | "ai") => {
    if (text.startsWith("\\") || text.includes("frac")) {
      text = "Xin lỗi, tôi không thể hiển thị công thức toán học.";
    }
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    displayMessage(message, "user");
    setInputValue("");

    try {
      const conversationId = sessionStorage.getItem("conversationId") || "new";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      const data = await response.json();
      const aiResponse = data.response || "Xin lỗi, tôi không thể phản hồi lúc này.";

      displayMessage(aiResponse, "ai");
    } catch (error) {
      displayMessage("Lỗi khi gửi tin nhắn!", "ai");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <div id="chat-icon" onClick={handleIconClick} style={{ cursor: "pointer" }}>
        🤖
      </div>

      {isOpen && (
        <div id="chat-container" style={{ display: "flex", flexDirection: "column", width: "300px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
          <div id="chat-header">Tư vấn Nha khoa</div>
          <div id="chat-messages" style={{ flex: 1, overflowY: "auto", maxHeight: "300px", marginTop: "10px" }}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`} style={{ margin: "4px 0" }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div id="chat-input-container" style={{ display: "flex", marginTop: "10px" }}>
            <input
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              style={{ flex: 1, marginRight: "5px" }}
            />
            <button id="send-btn" onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
