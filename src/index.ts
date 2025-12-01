import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/Env";
import type { Message } from "./types/message";
import { chat } from "./llm/groq_client";
import { ConversationDurableObject } from "./durable_objects/ConversationDurableObject";
import { addMessageToConversation } from "./utils/conversation";
import { logger } from "./utils/logger";
import { limiter } from "./utils/rateLimiter";
import { DurableObjectRateLimiter } from "@hono-rate-limiter/cloudflare";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "https://weather-agent-frontend.pages.dev",
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/chat", limiter);

app.get("/", (c) => c.text("the worker is working!"));

app.post("/api/chat", async (c) => {
  let stub: DurableObjectStub | undefined;
  let result: any;

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
    const conversationStub = c.env.CONVERSATIONS.get(id);
    stub = conversationStub;

    await addMessageToConversation(conversationStub, messageObj);

    const historyResponse = await conversationStub.fetch(
      new Request("http://do/get"),
    );
    const history: Message[] = await historyResponse.json();

    result = await chat(history, c.env);

    return result.toTextStreamResponse();
  } catch (error) {
    logger.error({ error }, "Chat endpoint error");
    return c.json({ error: "Internal server error" }, 500);
  } finally {
    if (stub && result) {
      const assistantMessage = await result.text;
      const assistantMessageObj: Message = {
        id: crypto.randomUUID(),
        modelMessage: { role: "assistant", content: assistantMessage },
        timestamp: new Date(),
      };
      await addMessageToConversation(stub, assistantMessageObj);
    }
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
export { ConversationDurableObject, DurableObjectRateLimiter };
