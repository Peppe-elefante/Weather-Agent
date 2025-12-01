import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/Env";
import type { Message } from "./types/message";
import { chat } from "./llm/groq_client";
import { ConversationDurableObject } from "./durable_objects/ConversationDurableObject";
import { addMessageToConversation } from "./utils/conversation";
import { logger } from "./utils/logger";
import { limiter } from "./utils/rateLimiter";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());
app.use("/api/*", limiter);

app.post("/api/chat", async (c) => {
  try {
    const {
      messageObj,
      sessionId,
    }: { messageObj: Message; sessionId: string } = await c.req.json();

    if (!messageObj?.modelMessage?.content) {
      return c.json({ error: "Message is required" }, 400);
    }

    logger.info(`received chat message: ${messageObj.modelMessage.content}`);

    const id = c.env.CONVERSATIONS.idFromName(sessionId);
    const stub = c.env.CONVERSATIONS.get(id);

    await addMessageToConversation(stub, messageObj);

    const historyResponse = await stub.fetch(new Request("http://do/get"));
    const history: Message[] = await historyResponse.json();

    const stream = await chat(history, c.env);

    (async () => {
      try {
        const response = await stream.response;
        for (const message of response.messages) {
          await addMessageToConversation(stub, {
            id: messageObj.id,
            modelMessage: message,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        logger.error({ error }, "Error saving messages to conversation");
      }
    })();

    return stream.toTextStreamResponse();
  } catch (error) {
    logger.error({ error }, "Chat endpoint error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/api/clear-chat", async (c) => {
  try {
    const { sessionId }: { sessionId: string } = await c.req.json();

    if (!sessionId) {
      return c.json({ error: "Session ID is required" }, 400);
    }

    logger.info(`clearing chat for session: ${sessionId}`);

    const id = c.env.CONVERSATIONS.idFromName(sessionId);
    const stub = c.env.CONVERSATIONS.get(id);

    const clearResponse = await stub.fetch(new Request("http://do/clear"));
    const result = await clearResponse.json();

    return c.json(result);
  } catch (error) {
    logger.error({ error }, "Clear chat endpoint error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
export { ConversationDurableObject };
