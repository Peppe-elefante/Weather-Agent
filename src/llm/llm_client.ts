import { createWorkersAI } from "workers-ai-provider";
import { streamText, stepCountIs } from "ai";
import { Message, Env } from "../types";
import { logger, getCurrentDateString } from "../utils";
import { WEATHER_PROMPT } from "./system_prompts";
import { geocodeTool, forecastTool } from "../tools";

export const chat = async (message_history: Message[], env: Env) => {
  const workersai = createWorkersAI({ binding: env.AI });

  try {
    logger.info(`Processing chat message: ${message_history?.at(-1)?.id}`);

    const dateString = getCurrentDateString();
    let messages_prompt = WEATHER_PROMPT(dateString).concat(
      message_history.map((m) => m.modelMessage),
    );

    const result = streamText({
      model: workersai("@cf/meta/llama-3-8b-instruct"),
      messages: messages_prompt,
      tools: {
        geocodeTool: geocodeTool(env),
        forecastTool: forecastTool(env),
      },
      stopWhen: stepCountIs(5),
    });

    return result;
  } catch (error) {
    logger.error({ error }, "Error generating chat response");
    throw error;
  }
};
