import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { listThreads, createThread } from "@/lib/threads";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const threads = await listThreads();
      if (threads.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
        return;
      }
      const t = await createThread({ mode: "general" });
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    })();
  }, [navigate]);
  return (
    <div className="min-h-screen grid place-items-center text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
