import { DurableObjectStore } from "@hono-rate-limiter/cloudflare";
import { rateLimiter } from "hono-rate-limiter";
import type { Context, Next } from "hono";
import type { Env } from "../types";

export const limiter = (c: Context<{ Bindings: Env }>, next: Next) =>
  rateLimiter<{ Bindings: Env }>({
    windowMs: 5 * 60 * 1000,
    limit: 3000,
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
    store: new DurableObjectStore({ namespace: c.env.CACHE }),
  })(c, next);
