# Vivarium

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
vivarium/
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

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Development

Run both backend and frontend in development mode:
```bash
npm run dev
```

Or run them separately:

Backend (Cloudflare Workers):
```bash
npm run dev:backend
```

Frontend (Vite dev server):
```bash
npm run dev:frontend
```

The backend will run on `http://localhost:8787` and the frontend on `http://localhost:5173`.

### Building

Build the frontend:
```bash
npm run build:frontend
```

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

Note: Make sure you have configured your Cloudflare account with Wrangler before deploying.

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
