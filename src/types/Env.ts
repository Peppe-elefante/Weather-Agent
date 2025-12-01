import type { DurableObjectRateLimiter } from "@hono-rate-limiter/cloudflare";
import type { DurableObjectNamespace } from "cloudflare:workers";

export interface Env {
    GROQ_API_KEY: string
    CONVERSATIONS: DurableObjectNamespace
    CACHE: DurableObjectNamespace<DurableObjectRateLimiter>
}