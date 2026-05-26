import { createFileRoute } from "@tanstack/react-router";
import { ChatLayout } from "@/components/chat-layout";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  return <ChatLayout threadId={threadId} />;
}
