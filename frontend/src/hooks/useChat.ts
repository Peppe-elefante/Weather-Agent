import { useState, useEffect } from "react";
import { Message } from "../types/message";
import {
  sendChatMessage,
  clearChat as clearChatApi,
  getChat,
} from "../services/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await getChat();
        console.log(JSON.stringify(loadedMessages));
        setMessages(loadedMessages);
      } catch (error) {
        console.error("Failed to load chat messages:", error);
      }
    };

    loadMessages();
  }, []);

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
            : msg,
        ),
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
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear the chat? The weather agent's memory will be wiped and it won't remember previous conversations.",
    );

    if (!confirmed) return;

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
