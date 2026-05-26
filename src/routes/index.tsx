import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Mail,
  FileText,
  CalendarClock,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Worklytic — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate emails, summarize meetings, plan your schedule, and research faster with Worklytic's AI-powered workplace tools.",
      },
      { property: "og:title", content: "Worklytic — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate emails, summarize meetings, plan your schedule, and research faster with Worklytic's AI-powered workplace tools.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Worklytic</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Chatting
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
          <Zap className="h-3 w-3" />
          No sign-up required. Works instantly in your browser.
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Your AI-powered
          <br />
          <span className="text-primary">workplace assistant</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Draft emails in seconds, summarize meetings automatically, build focused schedules, and
          research faster — all in one clean, fast interface.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try it free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            See features
          </a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
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
    </section>
  );
}

const FEATURES = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Describe the email you need — recipient, tone, purpose — and get a polished, professional draft instantly. No more staring at a blank screen.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description:
      "Paste raw meeting notes or a transcript. AI extracts key decisions, action items with owners, and deadlines into a clean, shareable summary.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: CalendarClock,
    title: "AI Task Planner",
    description:
      "Dump your task list and let AI prioritize using the Eisenhower matrix, build time-blocked schedules, and suggest productivity tips.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: BookOpen,
    title: "AI Research Assistant",
    description:
      "Share a topic or paste an article. Get concise summaries, key insights, actionable recommendations, and an ELI5 explanation.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: MessageSquare,
    title: "General AI Chat",
    description:
      "A fast, reliable copilot for any workplace question. The AI automatically picks the right format — lists, tables, structured emails — for every task.",
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-950/30",
  },
];

function Features() {
  return (
    <section id="features" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Five tools. One fast interface.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Switch between dedicated AI modes or let the general assistant handle everything.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition hover:shadow-md hover:border-primary/20"
            >
              <div className={cn("h-10 w-10 rounded-lg grid place-items-center mb-4", f.bg)}>
                <f.icon className={cn("h-5 w-5", f.color)} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Sparkles,
      title: "Choose a mode",
      desc: "Pick Email, Notes, Planner, Research, or General from the sidebar.",
    },
    {
      icon: MessageSquare,
      title: "Describe your task",
      desc: "Type naturally. The AI understands context, tone, and intent.",
    },
    {
      icon: Zap,
      title: "Get structured output",
      desc: "Receive clean Markdown — tables, action items, schedules — ready to copy.",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Three simple steps to automate your busy work.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 text-primary grid place-items-center mb-4">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to get more done?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Start using Worklytic right now. No account. No credit card. Your chats are saved
            locally in your browser.
          </p>
          <div className="mt-8">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Privacy-first
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Instant access
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Worklytic</span>
        </div>
        <p>Built with AI. No auth required. Local-first.</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/chat" className="hover:text-foreground transition-colors">
            Chat
          </Link>
        </div>
      </div>
    </footer>
  );
}

function cn(...inputs: Array<string | false | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
