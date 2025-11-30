import { useState } from "react";
import { Message } from "../types/message";
import { sendChatMessage, clearChat as clearChatApi } from "../services/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      modelMessage: {
        role: "user",
        content: text,
      },
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        modelMessage: {
          role: "assistant",
          content: responseText,
        },
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        modelMessage: {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await clearChatApi();
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
}
