// src/components/InteractiveChat.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { conversationMap } from "../Constants";
import Speech from './Speech';

const InteractiveChat = ({ onSendAgentMessage, speechRef, onUserSelection, resetConversation }) => {
  const [currentStep, setCurrentStep] = useState("initial");
  const navigate = useNavigate();

  const handleUserSelection = (option) => {
    onUserSelection(option.text);

    if (option.action) {
      handleAction(option.action);
      return;
    }

    if (option.next) {
      setCurrentStep(option.next);
      const nextStepDetails = conversationMap[option.next];

      if (nextStepDetails.isEnd) {
        onSendAgentMessage(nextStepDetails.agentResponse, ["Idle"]); // Play Idle if conversation ends
        return;
      }

      // Pass the agent response and animation sequence to `onSendAgentMessage`
      onSendAgentMessage(
        nextStepDetails.agentResponse,
        Array.isArray(nextStepDetails.animation) ? nextStepDetails.animation : [nextStepDetails.animation]
      );

      // Trigger speech for agent's response
      if (speechRef && speechRef.current) {
        window.speechSynthesis.cancel(); // Cancel any previous speech
        speechRef.current.speak(nextStepDetails.agentResponse);
      }
    }
  };

  const handleAction = (action) => {
    switch (action.type) {
      case "RESET":
        resetConversation();
        setCurrentStep("initial");
        break;
      case "EXIT":
        navigate("/landing");
        break;
      default:
        console.warn("Unknown action type:", action.type);
    }
  };

  const renderOptions = () => {
    const currentOptions = conversationMap[currentStep];

    if (Array.isArray(currentOptions)) {
      return currentOptions.map((option, index) => (
        <button key={index} onClick={() => handleUserSelection(option)}>
          {option.text}
        </button>
      ));
    }

    if (currentOptions && currentOptions.agentResponse && currentOptions.nextOptions) {
      return (
        <div>
          <p>{currentOptions.agentResponse}</p>
          {currentOptions.nextOptions.map((option, idx) => (
            <button key={idx} onClick={() => handleUserSelection(option)}>
              {option.text}
            </button>
          ))}
        </div>
      );
    }

    return <p>{currentOptions?.agentResponse || "Conversation ended or configuration error."}</p>;
  };

  return (
    <div className="interactive-chat-section">
      {renderOptions()}
    </div>
  );
};

export default InteractiveChat;
