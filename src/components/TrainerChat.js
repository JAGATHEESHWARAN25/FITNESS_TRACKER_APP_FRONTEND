import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrainerChat.css";

export default function TrainerChat() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const trainerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // 🔹 Fetch members assigned to this trainer
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/trainer/${trainerId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mappedMembers = res.data.map((a) => a.member);
        setMembers(mappedMembers);
      })
      .catch((err) => console.error("Failed to fetch members:", err));
  }, [trainerId, token]);

  // 🔹 Load chat when member selected
  useEffect(() => {
    if (selectedMember) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedMember]);

  const fetchMessages = () => {
    axios
      .get(
        `http://localhost:8080/api/messages/chat/${trainerId}/${selectedMember.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading messages:", err));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    axios
      .post(
        `http://localhost:8080/api/messages/send?senderId=${trainerId}&receiverId=${selectedMember.id}`,
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
    <div className="trainer-chat-container">
      {/* Sidebar */}
      <div className="member-list">
        <h3>My Members</h3>
        {members.map((m) => (
          <div
            key={m.id}
            className={`member-item ${
              selectedMember?.id === m.id ? "active" : ""
            }`}
            onClick={() => setSelectedMember(m)}
          >
            {m.username}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="chat-container">
        {selectedMember ? (
          <>
            <div className="chat-header">
              Chat with {selectedMember.username}
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender.id === parseInt(trainerId)
                      ? "sent"
                      : "received"
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
          <p style={{ margin: "20px" }}>Select a member to start chat</p>
        )}
      </div>
    </div>
  );
}
