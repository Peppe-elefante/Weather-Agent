import { Message } from "../types/message";

// Use environment variable for API URL with fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";
const API_URL = `${API_BASE_URL}/api/chat`;
const CLEAR_API_URL = `${API_BASE_URL}/api/clear-chat`;

export interface ChatApiResponse {
  response: string;
}

function getOrCreateSessionId(): string {
  const SESSION_KEY = "weather-agent-session-id";
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export async function sendChatMessage(text: string): Promise<string> {
  const message: Message = {
    id: crypto.randomUUID().toString(),
    modelMessage: {
      role: "user",
      content: text,
    },
    timestamp: new Date(),
  };

  const payload = {
    messageObj: message,
    sessionId: getOrCreateSessionId(),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to get response from server");
  }

  const data: ChatApiResponse = await response.json();
  return data.response || "No response received";
}

export async function clearChat(): Promise<void> {
  const payload = {
    sessionId: getOrCreateSessionId(),
  };

  const response = await fetch(CLEAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to clear chat");
  }
}
