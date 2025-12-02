import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudBolt, faTrash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InfoModal } from "./InfoModal";

interface ChatHeaderProps {
  onClearChat: () => void;
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header>
        <h1>
          Weather Chat <FontAwesomeIcon icon={faCloudBolt} />
        </h1>
        <div className="header-buttons">
          <button onClick={() => setIsModalOpen(true)} className="info-btn" title="About this chatbot">
            <FontAwesomeIcon icon={faInfoCircle} /> Info
          </button>
          <button onClick={onClearChat} className="clear-chat-btn" title="Clear chat">
            <FontAwesomeIcon icon={faTrash} /> Clear Chat
          </button>
        </div>
      </header>
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
