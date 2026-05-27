import type { ChatMode } from "./prompts";

export type StoredMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: unknown; // UIMessage
  created_at: string;
};

export type StoredThread = {
  id: string;
  title: string;
  mode: ChatMode;
  updated_at: string;
  messages: StoredMessage[];
};

const KEY = "worklytic.threads.v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): Record<string, StoredThread> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredThread>) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, StoredThread>) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(all));
}

function uid() {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function listThreads(): Promise<
  Array<Pick<StoredThread, "id" | "title" | "mode" | "updated_at">>
> {
  const all = Object.values(readAll());
  return all
    .map(({ id, title, mode, updated_at }) => ({ id, title, mode, updated_at }))
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

export async function createThread(opts: { mode: ChatMode; title?: string }): Promise<{
  id: string;
  title: string;
  mode: ChatMode;
}> {
  const all = readAll();
  const id = uid();
  const t: StoredThread = {
    id,
    title: opts.title ?? "New chat",
    mode: opts.mode,
    updated_at: new Date().toISOString(),
    messages: [],
  };
  all[id] = t;
  writeAll(all);
  return { id: t.id, title: t.title, mode: t.mode };
}

export async function renameThread(id: string, title: string) {
  const all = readAll();
  if (all[id]) {
    all[id].title = title;
    all[id].updated_at = new Date().toISOString();
    writeAll(all);
  }
}

export async function deleteThread(id: string) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}

export async function setThreadMode(id: string, mode: ChatMode) {
  const all = readAll();
  if (all[id]) {
    all[id].mode = mode;
    all[id].updated_at = new Date().toISOString();
    writeAll(all);
  }
}

export async function findEmptyThread(mode?: ChatMode): Promise<StoredThread | null> {
  const all = Object.values(readAll());
  const empty = all.filter((t) => (t.messages ?? []).length === 0);
  if (mode) {
    return empty.find((t) => t.mode === mode) ?? null;
  }
  return empty[0] ?? null;
}

export async function getThread(id: string): Promise<{
  thread: { id: string; title: string; mode: ChatMode };
  messages: StoredMessage[];
} | null> {
  const all = readAll();
  const t = all[id];
  if (!t) return null;
  return {
    thread: { id: t.id, title: t.title, mode: t.mode },
    messages: t.messages ?? [],
  };
}

export async function saveMessages(id: string, messages: unknown[]) {
  const all = readAll();
  const t = all[id];
  if (!t) return;
  t.messages = messages.map((m, i) => ({
    id: (m as { id?: string }).id ?? `${i}`,
    role: ((m as { role?: StoredMessage["role"] }).role ?? "assistant"),
    content: m,
    created_at: new Date().toISOString(),
  }));
  t.updated_at = new Date().toISOString();
  // auto-title from first user message
  if (t.title === "New chat") {
    const firstUser = messages.find((m) => (m as { role?: string }).role === "user") as
      | { parts?: Array<{ type: string; text?: string }> }
      | undefined;
    const text = firstUser?.parts?.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
    if (text) t.title = text.slice(0, 60);
  }
  writeAll(all);
}
