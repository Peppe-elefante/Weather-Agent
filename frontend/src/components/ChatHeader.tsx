import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudBolt } from "@fortawesome/free-solid-svg-icons";

export function ChatHeader() {
  return (
    <header>
      <h1>
        Weather Chat <FontAwesomeIcon icon={faCloudBolt} />
      </h1>
    </header>
  );
}
