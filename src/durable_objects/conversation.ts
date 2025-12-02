import type { Message } from "../types/message";

export async function addMessageToConversation(
  stub: DurableObjectStub,
  message: Message | { id: string; modelMessage: any; timestamp: Date }
) {
  await stub.fetch(
    new Request("http://do/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  );
}
