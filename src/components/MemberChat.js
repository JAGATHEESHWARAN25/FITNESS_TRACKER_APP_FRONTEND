import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MemberChat.css";

export default function MemberChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const memberId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [trainer, setTrainer] = useState(null);

  // 🔹 Fetch trainer assigned to this member
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/member/${memberId}/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setTrainer(res.data[0].trainer); // take first trainer
        }
      })
      .catch((err) => console.error("Failed to fetch trainer:", err));
  }, [memberId, token]);

  // 🔹 Fetch messages with trainer
  useEffect(() => {
    if (trainer) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [trainer]);

  const fetchMessages = () => {
    axios
      .get(
        `http://localhost:8080/api/messages/chat/${memberId}/${trainer.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading messages:", err));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    axios
      .post(
        `http://localhost:8080/api/messages/send?senderId=${memberId}&receiverId=${trainer.id}`,
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
        }
      )
      .then(() => {
        setNewMessage("");
        fetchMessages();
      });
  };

  return (
    <div className="chat-container">
      {trainer ? (
        <>
          <div className="chat-header">Chat with {trainer.username}</div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.sender.id === parseInt(memberId) ? "sent" : "received"
                }`}
              >
                <span className="bubble">{msg.content}</span>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="chat-send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        <p style={{ margin: "20px" }}>Loading your trainer...</p>
      )}
    </div>
  );
}
