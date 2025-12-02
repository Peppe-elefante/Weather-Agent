# Weather agent

A full-stack web application built with Cloudflare Workers, Hono, React, and AI capabilities.

## Tech Stack

### Backend

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **AI**: Vercel AI SDK with Cloudflare Agents
- **Language**: TypeScript
- **Tooling**: Biome (linting & formatting)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Tooling**: Biome (linting & formatting)

````

## Setup Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** package manager
- **Git** (for version control)
- **Cloudflare Account** (free tier available at [cloudflare.com](https://cloudflare.com))

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd weather-agent
````

### Step 2: Install Dependencies

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Backend (Required)

Set up your API keys for AI and weather functionality:

1. **Groq API Key** (for AI functionality):

```bash
npx wrangler secret put GROQ_API_KEY
```

When prompted, paste your Groq API key. You can get a free API key from [console.groq.com](https://console.groq.com).

2. **WeatherAPI Key** (for weather data):

```bash
npx wrangler secret put WEATHER_API_KEY
```

When prompted, paste your WeatherAPI key. You can get a free API key from [weatherapi.com](https://www.weatherapi.com).

#### Frontend (Optional)

The frontend uses environment variables for API configuration. For development, the defaults work out of the box. For production deployment:

1. Copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

2. Edit `.env` and set your production API URL:

```
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev
```

### Step 4: Configure Cloudflare Wrangler

1. **Login to Cloudflare:**

```bash
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

2. **Verify your configuration:**
   The [wrangler.toml](wrangler.toml) file is already configured with:

- AI binding for Cloudflare Workers AI
- Durable Objects for conversation persistence
- Observability enabled

3. **Optional - Update your worker name:**
   Edit [wrangler.toml](wrangler.toml) if you want to change the worker name from `weather-agent` to something else.

### Step 5: Development Setup

#### Option 1: Run Everything Together (Recommended)

Start both backend and frontend in development mode:

```bash
npm run dev
```

This will launch:

- Backend (Cloudflare Workers) on `http://localhost:8787`
- Frontend (Vite dev server) on `http://localhost:5173`

#### Option 2: Run Separately

Run backend only:

```bash
npm run dev:backend
```

Run frontend only (in a separate terminal):

```bash
npm run dev:frontend
```

### Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the weather agent frontend interface
3. The backend API will be accessible at `http://localhost:8787`
4. Try asking about the weather in any city (e.g., "What's the weather in London?")

### Building for Production

Build the frontend for production:

```bash
npm run build:frontend
```

This creates an optimized production build in the `frontend/dist` directory.

### Deployment

#### Deploy Backend

Deploy the backend to Cloudflare Workers:

```bash
npm run deploy:backend
npm run deploy:frontend
```

**First-time deployment notes:**

- The deployment will create the Durable Object namespace automatically
- Ensure you have completed `wrangler login` before deploying
- Make sure both `GROQ_API_KEY` and `WEATHER_API_KEY` secrets are configured (see Step 3)
- Your worker will be deployed to `https://weather-agent.<your-subdomain>.workers.dev`
- Your frontend will be deployed to `https://weather-agent-frontend.<your-subdomain>.workers.dev`

### Troubleshooting

#### Port already in use

If ports 8787 or 5173 are already in use, you can:

- Kill the process using that port
- Or modify the port in [frontend/vite.config.ts](frontend/vite.config.ts) for the frontend

#### Wrangler authentication issues

```bash
npx wrangler logout
npx wrangler login
```

#### Dependencies issues

Clear npm cache and reinstall:

```bash
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install
```

#### Type errors

Run type checking to identify issues:

```bash
npm run type-check
```

## API Endpoints

- `POST /api/chat` - AI chat endpoint
- `POST /api/clear-chat` - clear chat history
- `GET /api/chat` - retriev AI chat history

## Configuration

### Cloudflare Workers

Edit [wrangler.toml](wrangler.toml) to configure your Cloudflare Workers settings.

### Vite

Edit [frontend/vite.config.ts](frontend/vite.config.ts) to configure Vite settings.

### Biome

Edit [biome.json](biome.json) and [frontend/biome.json](frontend/biome.json) to customize linting and formatting rules.
