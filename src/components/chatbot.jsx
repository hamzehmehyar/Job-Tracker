import React, { useState } from "react";

import "./styles/chatBot.css";

import Navbar from "./navbar";

export default function Chatbot() {

  const [messages, setMessages] = useState([

    { sender: "ai", text: "Hi! I’m your career assistant. Ask me anything about jobs or careers." },

  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/chat", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),

      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn’t generate a response.";

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);

    } catch (error) {

      console.error(error);
      setMessages((prev) => [

        ...prev,
        { sender: "ai", text: "Error: failed to fetch response." },

      ]);

    }

    setLoading(false);

  };


  return (

    <>

        <Navbar />

        <div className="chat-container">

            <div className="chat-box">

            {messages.map((msg, idx) => (

                <div

                key={idx}
                className={`message ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}

                >

                {msg.text}

                </div>

            ))}

            {loading && <div className="ai-bubble">Typing...</div>}

            </div>

            <div className="input-container">

            <input

                type="text"
                placeholder="Ask about jobs or careers..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="chat-input"

            />
            <button

                onClick={handleSend}
                disabled={loading}
                className="send-button"

            >

                Send

            </button>

            </div>

        </div>

    </>

);

}
