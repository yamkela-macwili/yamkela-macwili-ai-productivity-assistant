import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listThreads,
  createThread,
  deleteThread,
  getThread,
  setThreadMode,
  findEmptyThread,
} from "@/lib/threads";
import { MODE_META, type ChatMode } from "@/lib/prompts";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BrainCircuit,
  Mail,
  FileText,
  CalendarClock,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODE_ICONS: Record<ChatMode, React.ComponentType<{ className?: string }>> = {
  general: MessageSquare,
  email: Mail,
  notes: FileText,
  planner: CalendarClock,
  research: BookOpen,
};

export function AppSidebar({ activeThreadId }: { activeThreadId?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  // keep subscription so list updates when route changes
  useRouterState({ select: (s) => s.location.pathname });

  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: () => listThreads(),
  });

  const pickMut = useMutation({
    mutationFn: async (mode: ChatMode) => {
      // 1. If active thread is empty, just switch its mode
      if (activeThreadId) {
        const cur = await getThread(activeThreadId);
        if (cur && (cur.messages ?? []).length === 0) {
          await setThreadMode(activeThreadId, mode);
          return { id: activeThreadId, reused: true };
        }
      }
      // 2. Reuse any existing empty thread of this mode
      const empty = await findEmptyThread(mode);
      if (empty) return { id: empty.id, reused: true };
      // 3. Otherwise create a new thread
      const t = await createThread({ mode });
      return { id: t.id, reused: false };
    },
    onSuccess: ({ id }) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      qc.invalidateQueries({ queryKey: ["thread", id] });
      navigate({ to: "/chat/$threadId", params: { threadId: id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteThread(id),
    onSuccess: async (_d, id) => {
      await qc.invalidateQueries({ queryKey: ["threads"] });
      if (id === activeThreadId) navigate({ to: "/chat" });
    },
  });

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 flex-1 min-w-0" aria-label="Home">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center shrink-0">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span className="font-semibold truncate">AI Productivity Assistant</span>
        </Link>
      </div>

      <div className="p-3 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-2">
          Quick start
        </p>
        {(Object.keys(MODE_META) as ChatMode[]).map((mode) => {
          const Icon = MODE_ICONS[mode];
          return (
            <button
              key={mode}
              onClick={() => createMut.mutate(mode)}
              disabled={createMut.isPending}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm hover:bg-sidebar-accent transition-colors text-left"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{MODE_META[mode].label}</span>
              <Plus className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-60" />
            </button>
          );
        })}
      </div>

      <div className="px-3 pt-2 pb-1 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2">
          Recent chats
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => createMut.mutate("general")}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 pb-2">
          {threads.length === 0 && (
            <p className="text-xs text-muted-foreground px-3 py-2">No chats yet.</p>
          )}
          {threads.map((t) => {
            const Icon = MODE_ICONS[(t.mode as ChatMode) ?? "general"];
            const active = t.id === activeThreadId;
            return (
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
                )}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{t.title}</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteMut.mutate(t.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-sidebar-border text-[11px] text-muted-foreground">
        Chats are saved locally in this browser.
      </div>
    </aside>
  );
}
