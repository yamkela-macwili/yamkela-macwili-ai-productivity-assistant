import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppSidebar } from "./app-sidebar";
import { ChatWindow } from "./chat-window";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function ChatLayout({ threadId }: { threadId: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background">
      {desktopOpen && (
        <div className="hidden md:flex">
          <AppSidebar activeThreadId={threadId} />
        </div>
      )}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AppSidebar activeThreadId={threadId} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-3 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setDesktopOpen((v) => !v)}
            aria-label={desktopOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {desktopOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>
          <span className="font-semibold flex-1 truncate md:hidden">
            AI Productivity Assistant
          </span>
          <div className="flex-1 hidden md:block" />
          <ThemeToggle />
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
