import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <span className="font-semibold">Worklytic</span>
        </header>
        <ChatWindow key={threadId} threadId={threadId} />
      </main>
    </div>
  );
}
