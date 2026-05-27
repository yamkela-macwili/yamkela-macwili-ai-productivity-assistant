import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan your day, and research faster — all in one clean AI workspace.",
      },
      { property: "og:title", content: "AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan your day, and research faster — all in one clean AI workspace.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">AI Productivity Assistant</span>
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open app
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Your AI-powered
            <br />
            <span className="text-primary">workplace assistant</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            Draft emails in seconds, summarize meetings automatically, build focused schedules,
            and research faster — all in one clean, fast interface.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try it free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              See features
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              No login needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Local chat history
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Free to use
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
