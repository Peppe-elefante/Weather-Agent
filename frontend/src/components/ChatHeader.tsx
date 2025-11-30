import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudBolt, faTrash } from "@fortawesome/free-solid-svg-icons";

interface ChatHeaderProps {
  onClearChat: () => void;
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  return (
    <header>
      <h1>
        Weather Chat <FontAwesomeIcon icon={faCloudBolt} />
      </h1>
      <button onClick={onClearChat} className="clear-chat-btn" title="Clear chat">
        <FontAwesomeIcon icon={faTrash} /> Clear Chat
      </button>
    </header>
  );
}
