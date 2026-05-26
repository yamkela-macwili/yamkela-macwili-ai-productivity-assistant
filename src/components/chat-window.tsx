import { useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getThread } from "@/lib/threads.functions";
import { supabase } from "@/integrations/supabase/client";
import { MODE_META, type ChatMode } from "@/lib/prompts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Copy, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChatWindow({ threadId }: { threadId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThread({ data: { id: threadId } }),
  });

  if (isLoading || !data) {
    return (
      <div className="flex-1 grid place-items-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <ChatInner
      key={threadId}
      threadId={threadId}
      mode={data.thread.mode}
      title={data.thread.title}
      initialMessages={data.messages.map((m) => m.content as unknown as UIMessage)}
    />
  );
}

function ChatInner({
  threadId,
  mode,
  title,
  initialMessages,
}: {
  threadId: string;
  mode: ChatMode;
  title: string;
  initialMessages: UIMessage[];
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: async ({ messages }) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: { messages, threadId, mode },
          };
        },
      }),
    [threadId, mode],
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "Something went wrong."),
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const meta = MODE_META[mode];
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text || isLoading) return;
    inputRef.current!.value = "";
    await sendMessage({ text });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="hidden md:flex h-14 border-b border-border items-center px-6 gap-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none">{title}</span>
          <span className="text-xs text-muted-foreground mt-0.5">{meta.label}</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold">{meta.label}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{meta.description}</p>
              <p className="text-sm text-muted-foreground/80 max-w-md mx-auto pt-4">
                {meta.starter}
              </p>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onRegenerate={regenerate} />
          ))}

          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-md border border-destructive/30 bg-destructive/10 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error.message || "Request failed."}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/50 backdrop-blur">
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto p-4">
          <div className="relative rounded-2xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring transition">
            <Textarea
              ref={inputRef}
              placeholder={meta.placeholder}
              className="resize-none border-0 bg-transparent min-h-[60px] max-h-48 pr-14 focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as unknown as React.FormEvent);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="absolute right-2 bottom-2 h-9 w-9 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            AI outputs may be inaccurate. Do not share sensitive or confidential information.
          </p>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onRegenerate,
}: {
  message: UIMessage;
  onRegenerate: () => void;
}) {
  const text = message.parts
    ?.map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
  const isUser = message.role === "user";

  async function copy() {
    await navigator.clipboard.writeText(text || "");
    toast.success("Copied to clipboard");
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
          "prose-table:my-3 prose-th:bg-muted prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1",
          "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none",
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text || ""}</ReactMarkdown>
      </div>
      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={copy}>
          <Copy className="h-3 w-3 mr-1" /> Copy
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => onRegenerate()}
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Regenerate
        </Button>
      </div>
    </div>
  );
}
