import { createGroq } from "@ai-sdk/groq";
import { generateText, stepCountIs } from "ai";
import { Message } from "../types/message";
import { logger } from "../index";
import type { Env } from "../types/Env";
import { WEATHER_PROMPT } from "../utils/system_prompts";
import { weatherTool } from "../utils/tools";

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
      model: groq("llama-3.1-8b-instant"),
      messages: messages_prompt,
      tools: {
        weatherTool: weatherTool,
      },
      stopWhen: stepCountIs(5),
    });
    logger.info(`received chat message: ${JSON.stringify(result)}`);
    return result.text;
  } catch (error) {
    logger.error({ error }, "Error generating chat response");
    throw error;
  }
};
