import { createGroq } from "@ai-sdk/groq";
import { generateText, stepCountIs, ModelMessage } from "ai";
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

export interface ChatResult {
  text: string;
  messages: ModelMessage[];
}

export const chat = async (
  message_history: Message[],
  env: Env,
): Promise<ChatResult> => {
  const groq = createGroqClient(env);

  try {
    logger.info(`Processing chat message: ${message_history?.at(-1)?.id}`);

    let messages_prompt = WEATHER_PROMPT(
      new Date().toLocaleDateString(),
    ).concat(message_history.map((m) => m.modelMessage));

    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      messages: messages_prompt,
      tools: {
        weatherTool,
      },
      stopWhen: stepCountIs(5),
    });

    logger.info(`received AI response message: ${JSON.stringify(result.text)}`);
    logger.info(`response steps count: ${result.response.messages.length}`);

    return {
      text: result.text,
      messages: result.response.messages,
    };
  } catch (error) {
    logger.error({ error }, "Error generating chat response");
    throw error;
  }
};
