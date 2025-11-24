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

app.get("/", (c) => {
  return c.json({ message: "Welcome to Vivarium API" });
});

app.get("/health", (c) => {
  return c.json({ status: "healthy" });
});

// AI endpoint example
app.post("/api/chat", async (c) => {
  try {
    const messageObj: Message = await c.req.json();
    logger.info(`received chat message: ${messageObj.modelMessage.content}`);
    if (!messageObj.modelMessage.content) {
      return c.json({ error: "Message is required" }, 400);
    }

    const ai_response = await chat(messageObj, c.env);

    return c.json({
      response: ai_response,
    });
  } catch (error) {
    logger.error({ error }, "Chat endpoint error");
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
