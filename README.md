# Worklytic — AI Workplace Productivity Assistant

Worklytic is a modern, high-performance web application that helps you automate workplace tasks using AI. Built with **React 19**, **TanStack Start**, **Tailwind CSS v4**, and **shadcn/ui**, it delivers a clean, responsive experience that feels like a real SaaS product.

---

## Features

| Feature | What it does |
|--------|-------------|
| **Smart Email Generator** | Describe an email (purpose, recipient, tone) and get a polished, professional draft instantly. |
| **Meeting Notes Summarizer** | Paste raw notes or a transcript. AI extracts key decisions, action items, owners, and deadlines. |
| **AI Task Planner** | Dump your task list and get an Eisenhower-prioritized, time-blocked schedule with productivity tips. |
| **AI Research Assistant** | Share a topic or article. Get concise summaries, key insights, recommendations, and an ELI5 version. |
| **General AI Chat** | A fast, reliable copilot that automatically picks the right format for any workplace question. |

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7 + SSR)
- **Styling:** Tailwind CSS v4 with native CSS `@theme` tokens
- **Components:** shadcn/ui (Radix UI primitives)
- **AI SDK:** AI SDK v4 + `@ai-sdk/react` with Lovable AI Gateway
- **State & Data:** TanStack Query + localStorage (local-first, no server state)
- **Markdown:** `react-markdown` with GitHub-flavored Markdown support

---

## Project Structure

```
src/
  routes/
    __root.tsx           # Root layout, providers, error boundaries
    index.tsx            # Landing page (marketing)
    chat.index.tsx       # Chat entry — creates or redirects to latest thread
    chat.$threadId.tsx   # Active chat thread view
    api/chat.ts          # Server route — streams AI responses
  components/
    app-sidebar.tsx      # Thread list + mode quick-start sidebar
    chat-layout.tsx      # Responsive layout (sidebar + chat window)
    chat-window.tsx      # Chat UI, messages, input, streaming
    ui/                  # shadcn/ui components
  lib/
    prompts.ts           # System prompts per AI mode
    threads.ts           # localStorage thread persistence
    ai-gateway.server.ts # Lovable AI Gateway provider setup
  integrations/
    supabase/            # Auth + database (disabled — app is local-first)
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A Lovable AI Gateway API key (set via `LOVABLE_API_KEY` env var)

### Install dependencies

```bash
bun install
```

### Environment variables

Create a `.env.local` file (or use the existing `.env`):

```bash
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

> The app uses Lovable AI Gateway (Google Gemini models) for AI responses. The API key is only used server-side.

### Run development server

```bash
bun run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
bun run build
```

---

## How It Works

1. **Landing page** (`/`) — showcases features and lets visitors jump straight into the app.
2. **Chat** (`/chat`) — automatically creates or redirects to the most recent thread.
3. **Thread view** (`/chat/:threadId`) — renders a dedicated AI chat with a mode-specific system prompt.
4. **AI streaming** — user messages are sent to `/api/chat`, which streams the AI response back in real time.
5. **Local persistence** — all threads and messages are stored in `localStorage` under the key `worklytic.threads.v1`.

---

## AI Modes

When you start a new chat, you pick a mode. Each mode customizes the AI's system prompt:

- **`general`** — Catch-all workplace assistant
- **`email`** — Business communication writer
- **`notes`** — Meeting synthesis and action items
- **`planner`** — Eisenhower matrix + time-blocking coach
- **`research`** — Research analyst with ELI5 summaries

---

## Authentication

This app is intentionally **auth-free**. There is no login, no sign-up, and no user accounts. Chats are saved locally in the browser. If you want to add authentication later, the Supabase integration is already wired in the codebase (`src/integrations/supabase/`).

---

## Customization

- **Design tokens** — Edit `src/styles.css` to change colors, radius, and semantic variables.
- **System prompts** — Edit `src/lib/prompts.ts` to tweak AI behavior per mode.
- **AI model** — Edit `src/routes/api/chat.ts` to change the model (e.g. `google/gemini-2.5-pro`).
- **Landing page** — Edit `src/routes/index.tsx` to update marketing copy.

---

## License

MIT — feel free to fork, customize, and deploy.
