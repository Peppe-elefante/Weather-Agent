import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/Env";
import type { Message } from "./types/message";
import { chat } from "./llm/groq_client";

import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty", // For development
    options: { colorize: true },
  },
});

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

export const conversations = new Map<string, Message[]>();

// AI endpoint example
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

    const history = conversations.get(sessionId) || [];
    history.push(messageObj);

    const ai_response = await chat(history, c.env);

    for (const message of ai_response.messages) {
      if (message.role !== "user") {
        history.push({
          id: messageObj.id,
          modelMessage: message,
          timestamp: new Date(),
        });
      }
    }

    conversations.set(sessionId, history);

    return c.json({
      response: ai_response.text,
    });
  } catch (error) {
    logger.error({ error }, "Chat endpoint error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
