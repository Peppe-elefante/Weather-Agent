import type { DurableObjectRateLimiter } from "@hono-rate-limiter/cloudflare";

export interface Env {
  AI: Ai;
  GROQ_API_KEY: string;
  CONVERSATIONS: DurableObjectNamespace;
  CACHE: DurableObjectNamespace<DurableObjectRateLimiter>;
  WEATHER_API_KEY: string;
}
