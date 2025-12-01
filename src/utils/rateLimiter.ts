import { rateLimiter } from "hono-rate-limiter";

export const limiter = rateLimiter({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-6",
  keyGenerator: async (c) => {
    try {
      const body = await c.req.json();
      return body.sessionId ?? c.req.header("x-forwarded-for") ?? "anonymous";
    } catch {
      return c.req.header("x-forwarded-for") ?? "anonymous";
    }
  },
});
