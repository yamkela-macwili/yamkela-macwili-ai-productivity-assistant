import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";

export function ChatLayout({ threadId }: { threadId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:flex">
        <AppSidebar activeThreadId={threadId} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AppSidebar activeThreadId={threadId} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-4 gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold flex-1">AI Productivity Assistant</span>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" aria-label="Home">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </header>
        <ChatWindow key={threadId} threadId={threadId} />
      </main>
    </div>
  );
}
