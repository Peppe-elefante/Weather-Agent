import { createGroq } from "@ai-sdk/groq";
import { generateText, ModelMessage } from "ai";
import { Message } from "../types/message";
import { logger } from "../index";
import type { Env } from "../types/Env";
import { WEATHER_PROMPT } from "../utils/system_prompts";

export const createGroqClient = (env: Env) => {
  return createGroq({
    apiKey: env.GROQ_API_KEY,
  });
};

export const chat = async (message: Message, env: Env) => {
  const groq = createGroqClient(env);

  try {
    logger.info(`Processing chat message: ${message.id}`);

    let messages_prompt = WEATHER_PROMPT.concat(message.modelMessage);

    const result = await generateText({
      model: groq("qwen/qwen3-32b"),
      messages: messages_prompt,
      providerOptions: {
        groq: {
          reasoningEffort: "none",
        },
      },
    });

    logger.info(
      `Chat response generated successfully for message: ${message.id}`,
    );
    return result.text;
  } catch (error) {
    logger.error({ error }, "Error generating chat response");
    throw error;
  }
};
