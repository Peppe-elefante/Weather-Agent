import { ModelMessage } from "ai";

export interface Message {
  id: string;
  modelMessage: ModelMessage;
  timestamp: Date;
  isPending?: boolean;
}
