import { Message } from "../types/message";
const API_URL = "http://localhost:8787/api/chat";
const CLEAR_API_URL = "http://localhost:8787/api/clear-chat";

export interface ChatApiResponse {
  response: string;
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
    sessionId: "default-session",
  };

  console.log(JSON.stringify(payload));
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
    sessionId: "default-session",
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
