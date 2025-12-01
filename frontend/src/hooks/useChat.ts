import { useState } from "react";
import { Message } from "../types/message";
import { sendChatMessage, clearChat as clearChatApi } from "../services/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessageId = Date.now().toString();
    const pendingAssistantId = `pending-${Date.now()}`;

    const userMessage: Message = {
      id: userMessageId,
      modelMessage: {
        role: "user",
        content: text,
      },
      timestamp: new Date(),
    };

    // Optimistically add user message and pending assistant message
    const pendingAssistantMessage: Message = {
      id: pendingAssistantId,
      modelMessage: {
        role: "assistant",
        content: "",
      },
      timestamp: new Date(),
      isPending: true,
    };

    setMessages((prev) => [...prev, userMessage, pendingAssistantMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(text);

      // Replace pending message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingAssistantId
            ? {
                ...msg,
                modelMessage: {
                  role: "assistant",
                  content: responseText,
                },
                isPending: false,
              }
            : msg
        )
      );
    } catch (error) {
      // Replace pending message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingAssistantId
            ? {
                ...msg,
                modelMessage: {
                  role: "assistant",
                  content: `Error: ${error instanceof Error ? error.message : "Failed to send message"}`,
                },
                isPending: false,
              }
            : msg
        )
      );
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
