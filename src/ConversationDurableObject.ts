import { DurableObject } from "cloudflare:workers";
import type { Message } from "./types/message";
import type { Env } from "./types/Env";

export class ConversationDurableObject extends DurableObject<Env>
{
  private messages: Message[] = [];

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      switch (path) {
        case "/get":
          return this.getMessages();
        case "/add":
          return await this.addMessage(request);
        case "/clear":
          return await this.clearMessages();
        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  private async getMessages(): Promise<Response> {
    if (this.messages.length === 0) {
      // Try to load from storage if not in memory
      const stored = await this.ctx.storage.get<Message[]>("messages");
      if (stored) {
        this.messages = stored;
      }
    }

    return new Response(JSON.stringify(this.messages), {
      headers: { "Content-Type": "application/json" },
    });
  }

  private async addMessage(request: Request): Promise<Response> {
    const message: Message = await request.json();

    // Load messages if not in memory
    if (this.messages.length === 0) {
      const stored = await this.ctx.storage.get<Message[]>("messages");
      if (stored) {
        this.messages = stored;
      }
    }

    this.messages.push(message);

    // Persist to durable storage
    await this.ctx.storage.put("messages", this.messages);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  private async clearMessages(): Promise<Response> {
    this.messages = [];
    await this.ctx.storage.delete("messages");

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
