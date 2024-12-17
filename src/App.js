// App.js

import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Avatar from "./components/Avatar";
import InteractiveChat from "./components/InteractiveChat";
import Speech from "./components/Speech";
import "./App.css";

const createNewMessageObject = (text, sender) => ({ text, sender });

function Agent() {
  const [messages, setMessages] = useState([]);
  const [lastMessageObject, setLastMessageObject] = useState("");
  const [currentAnimation, setCurrentAnimation] = useState("Idle");
  const speechRef = useRef();
  const navigate = useNavigate();

  // Retrieve the agent type from localStorage
  const agentType = localStorage.getItem("agentType") || "male";
  const avatarUrl = agentType === "female" ? "/models/female-avatar.glb" : "/models/original-avatar.glb";

  const handleExit = () => {
    navigate("/landing"); // Redirect to the landing page
  };

  const handleSendMessage = (message) => {
    const newMessageObject = createNewMessageObject(message, "User");
    setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    setLastMessageObject(newMessageObject);

    if (message.startsWith("/avatar ")) {
      const command = message.replace("/avatar ", "");
      window.postMessage(command, "https://readyplayer.me");
    }
  };

  const handleSendAvatarMessage = (message, animations = ["Idle"]) => {
    const newMessageObject = createNewMessageObject(message, "Avatar");
    setMessages((prevMessages) => [...prevMessages, newMessageObject]);

    if (speechRef.current) {
      speechRef.current.speak(message);
    }

    // Check if animations is an array, and play each animation sequentially
    if (Array.isArray(animations)) {
      animations.forEach((animation, index) => {
        setTimeout(() => {
          setCurrentAnimation(animation);
        }, index * 2000); // Adjust delay as needed (e.g., 1000ms = 1s)
      });
    } else {
      // If it's a single animation, just play it
      setCurrentAnimation(animations);
    }
  };

  const handleUserSelection = (selection) => {
    const userMessage = createNewMessageObject(selection, "User");
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  };

  const resetConversation = () => {
    setMessages([]);
    setLastMessageObject("");
    setCurrentAnimation("Idle");
  };

  return (
    <div className="container">
      <div className="left-section">
        <h2 className="agent-title">Virtual Agent ({agentType.charAt(0).toUpperCase() + agentType.slice(1)})</h2>
        <div className="avatar-container">
          <div className="exit-icon-wrapper" onClick={handleExit}>
            <FontAwesomeIcon icon={faArrowLeft} className="exit-icon" />
          </div>
          <Avatar
            avatarUrl={avatarUrl}
            chatMessageObject={lastMessageObject}
            currentAnimation={currentAnimation}
            onSendAvatarMessage={handleSendAvatarMessage}
          />
        </div>

        <div className="interactive-chat-section">
          <InteractiveChat 
            onSendAgentMessage={handleSendAvatarMessage} 
            speechRef={speechRef} 
            onUserSelection={handleUserSelection} 
            resetConversation={resetConversation}
          />
        </div>
      </div>

      <div className="chat-section">
        <h2 className="chat-title">Agent Chat</h2>
        <div className="chat-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.sender === "User" ? "User" : "Avatar"}`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <Speech ref={speechRef} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/agent" element={<Agent />} />
      </Routes>
    </Router>
  );
}

export default App;
