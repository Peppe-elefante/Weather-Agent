import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export function MessageSkeleton() {
  return (
    <div className="message message-assistant">
      <div className="message-content">
        <div className="message-sender">
          Assistant <FontAwesomeIcon icon={faRobot} />
        </div>
        <div className="message-text">
          <div className="skeleton-loader">
            <div className="skeleton-line skeleton-line-1"></div>
            <div className="skeleton-line skeleton-line-2"></div>
            <div className="skeleton-line skeleton-line-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
