import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Welcome to Vivarium API' })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

// AI endpoint example
app.post('/api/chat', async (c) => {
  try {
    const { message } = await c.req.json()

    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    // TODO: Implement AI SDK integration with Cloudflare AI
    // Example placeholder response
    return c.json({
      response: 'AI integration coming soon',
      message: message,
    })
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
