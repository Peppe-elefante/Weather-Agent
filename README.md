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

## Project Structure

```
weather-agent/
├── src/                    # Backend source code
│   ├── index.ts           # Main Hono app entry point
│   └── types.ts           # TypeScript type definitions
├── frontend/              # Frontend React application
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── vite.config.ts    # Vite configuration
│   ├── tsconfig.json     # Frontend TypeScript config
│   ├── biome.json        # Frontend Biome config
│   └── package.json      # Frontend dependencies
├── wrangler.toml         # Cloudflare Workers config
├── tsconfig.json         # Backend TypeScript config
├── biome.json            # Backend Biome config
├── package.json          # Backend dependencies
└── README.md
```

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
```

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

Set up your Groq API key for AI functionality:

```bash
npx wrangler secret put GROQ_API_KEY
```

When prompted, paste your Groq API key. You can get a free API key from [console.groq.com](https://console.groq.com).

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

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

**First-time deployment notes:**

- The deployment will create the Durable Object namespace automatically
- Ensure you have completed `wrangler login` before deploying
- Your worker will be deployed to `https://weather-agent.<your-subdomain>.workers.dev`

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

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `POST /api/chat` - AI chat endpoint (placeholder)

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Type Checking

```bash
npm run type-check
```

## Configuration

### Cloudflare Workers

Edit [wrangler.toml](wrangler.toml) to configure your Cloudflare Workers settings.

### Vite

Edit [frontend/vite.config.ts](frontend/vite.config.ts) to configure Vite settings.

### Biome

Edit [biome.json](biome.json) and [frontend/biome.json](frontend/biome.json) to customize linting and formatting rules.

## Next Steps

1. Set up Cloudflare AI binding in your Wrangler configuration
2. Implement AI SDK integration in the `/api/chat` endpoint
3. Build out your React components
4. Add authentication and database as needed

## License

MIT
