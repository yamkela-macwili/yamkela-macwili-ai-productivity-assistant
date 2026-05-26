import { createFileRoute } from "@tanstack/react-router";
import { ChatLayout } from "@/components/chat-layout";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  return <ChatLayout threadId={threadId} />;
}
