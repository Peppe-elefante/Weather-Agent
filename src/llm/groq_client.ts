import { createGroq } from "@ai-sdk/groq";
import { streamText, stepCountIs } from "ai";
import { Message } from "../types/message";
import { logger } from "../utils/logger";
import type { Env } from "../types/Env";
import { WEATHER_PROMPT } from "../utils/system_prompts";
import { weatherTool } from "../utils/tools";
import { getCurrentDateString } from "../utils/date";

export const createGroqClient = (env: Env) => {
  return createGroq({
    apiKey: env.GROQ_API_KEY,
  });
};

export const chat = async (message_history: Message[], env: Env) => {
  const groq = createGroqClient(env);

  try {
    logger.info(`Processing chat message: ${message_history?.at(-1)?.id}`);

    const dateString = getCurrentDateString();
    let messages_prompt = WEATHER_PROMPT(dateString).concat(
      message_history.map((m) => m.modelMessage),
    );

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: messages_prompt,
      tools: {
        weatherTool,
      },
      stopWhen: stepCountIs(5),
    });

    return result;
  } catch (error) {
    logger.error({ error }, "Error generating chat response");
    throw error;
  }
};
