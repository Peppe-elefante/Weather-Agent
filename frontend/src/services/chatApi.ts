import { Message } from "../types/message";

// Use environment variable for API URL with fallback to localhost for development
// NOTE: VITE_API_URL must be set as an environment variable in Cloudflare Pages (build settings)
// Alternative: Auto-detect API URL in production using window.location
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

export async function sendChatMessage(
  text: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
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
    if (response.status === 429) {
      throw new Error("You have sent too many requests. Please try again in five minutes.");
    }
    throw new Error("Failed to get response from server");
  }

  // Handle streaming response
  if (!response.body) {
    throw new Error("Response body is empty");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      // Call the onChunk callback if provided
      if (onChunk) {
        onChunk(chunk);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText || "No response received";
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
