import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About Weather Chat</h2>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <p>
            Welcome to <strong>Weather Chat</strong>! This is an intelligent weather assistant
            that helps you get accurate weather information and forecasts.
          </p>
          <h3>What can I do?</h3>
          <ul>
            <li>Get current weather conditions for any location</li>
            <li>View detailed weather forecasts</li>
            <li>Ask questions about weather patterns and conditions</li>
            <li>Receive weather alerts and updates</li>
          </ul>
          <h3>How to use:</h3>
          <p>
            Simply type your weather-related question in the chat box below and press Enter or
            click Send. You can ask questions like:
          </p>
          <ul>
            <li>"What's the weather like in New York?"</li>
            <li>"Will it rain tomorrow in London?"</li>
            <li>"Show me the 5-day forecast for Tokyo"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
