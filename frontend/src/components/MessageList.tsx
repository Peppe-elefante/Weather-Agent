import { useRef, useEffect } from "react";
import { Message } from "../types/message";
import { EmptyState } from "./EmptyState";
import { MessageSkeleton } from "./MessageSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faUser } from "@fortawesome/free-solid-svg-icons";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {messages.map((message) => {
        // Show skeleton loader for pending messages
        if (message.isPending) {
          return <MessageSkeleton key={message.id} />;
        }

        return (
          <div
            key={message.id}
            className={`message ${message.modelMessage.role === "user" ? "message-user" : "message-assistant"}`}
          >
            <div className="message-content">
              <div className="message-sender">
                {message.modelMessage.role === "user" ? (
                  <>
                    User <FontAwesomeIcon icon={faUser} />
                  </>
                ) : (
                  <>
                    Assistant <FontAwesomeIcon icon={faRobot} />
                  </>
                )}
              </div>
              <div className="message-text">
                {message.modelMessage.content as String}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
}
