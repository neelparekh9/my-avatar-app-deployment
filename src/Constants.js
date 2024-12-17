export const animationKeyResponseMap = {
  hi: {
    response: "Hello!",
    animation: ["Wave"]
  },
  yes: {
    response: "Yes, I agree!",
    animation: ["NodYes"]
  },
  no: {
    response: "No, I disagree!",
    animation: ["ShakeNo"]
  },
  idle: {
    response: "",
    animation: ["Idle"]
  }
};

export const conversationMap = {
  initial: [
    { text: "I’m stressed about…", next: "stressResponse" },
    { text: "I’m worried about…", next: "worryResponse" },
    { text: "I don’t feel supported to…", next: "supportResponse" },
    { text: "I don’t want to feel desperate about…", next: "desperationResponse" }
  ],

  stressResponse: {
    agentResponse: "The starting point whenever you feel stressed is to think about your own attitude. What's that?",
    nextOptions: [
      { text: "Zero Negativity", next: "zeroNegativity" },
      { text: "Tell me more about stress", next: "stressMoreInfo" }
    ],
    animation: ["NodYes", "Wave"] // Sequential animations
  },

  zeroNegativity: {
    agentResponse: "Zero Negativity is a simple promise to approach others with openness. Would you like to try it?",
    nextOptions: [
      { text: "Yes, I will", next: "stressMoreInfo" },
      { text: "No, tell me more about it", next: "stressMoreInfo" }
    ],
    animation: ["NodYes", "Idle"]
  },

  stressMoreInfo: {
    agentResponse: "Stress can affect many aspects of life. Let's talk about how to manage it. Which area would you like to explore?",
    nextOptions: [
      { text: "Work stress", next: "workStress" },
      { text: "Relationship stress", next: "relationshipStress" },
      { text: "General anxiety", next: "generalAnxiety" }
    ],
    animation: ["NodYes", "Idle"]
  },

  workStress: {
    agentResponse: "Work stress can be managed by setting boundaries. Would you like tips on managing workload?",
    nextOptions: [
      { text: "Yes, give me tips", next: "end" },
      { text: "No, what else can help?", next: "end" }
    ],
    animation: ["NodYes", "Wave", "Idle"] // Sequential animations
  },

  end: {
    agentResponse: "Thank you for the conversation! Would you like to exit or reset?",
    nextOptions: [
      { text: "Reset", action: { type: "RESET" } },
      { text: "Exit", action: { type: "EXIT" } }
    ],
    isEnd: true,
    animation: ["Wave", "Idle"]
  }
};
