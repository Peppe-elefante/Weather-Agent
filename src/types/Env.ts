import type { DurableObjectRateLimiter } from "@hono-rate-limiter/cloudflare";

export interface Env {
  GROQ_API_KEY: string;
  CONVERSATIONS: DurableObjectNamespace;
  CACHE: DurableObjectNamespace<DurableObjectRateLimiter>;
  WEATHER_API_KEY: string;
}
