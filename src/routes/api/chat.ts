import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getSystemPrompt, type ChatMode } from "@/lib/prompts";

type Body = {
  messages?: UIMessage[];
  threadId?: string;
  mode?: ChatMode;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = auth.replace("Bearer ", "");

        const url = process.env.SUPABASE_URL!;
        const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(url, anon, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = claims.claims.sub;

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = body.messages ?? [];
        const threadId = body.threadId;
        const mode: ChatMode = body.mode ?? "general";

        if (!threadId || !Array.isArray(messages) || messages.length === 0) {
          return new Response("Bad request", { status: 400 });
        }

        // verify thread belongs to user
        const { data: thread } = await supabase
          .from("threads")
          .select("id, mode, title")
          .eq("id", threadId)
          .maybeSingle();
        if (!thread) return new Response("Thread not found", { status: 404 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        // Persist the latest user message (last item in messages)
        const lastUser = messages[messages.length - 1];
        if (lastUser?.role === "user") {
          await supabase.from("messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            content: lastUser as never,
          });

          // Auto-title on first user message
          if (thread.title === "New chat") {
            const text = lastUser.parts
              ?.map((p) => (p.type === "text" ? p.text : ""))
              .join(" ")
              .trim();
            if (text) {
              const title = text.length > 60 ? text.slice(0, 57) + "..." : text;
              await supabase
                .from("threads")
                .update({ title, updated_at: new Date().toISOString() })
                .eq("id", threadId);
            }
          } else {
            await supabase
              .from("threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          }
        }

        const result = streamText({
          model,
          system: getSystemPrompt(mode),
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ responseMessage }) => {
            try {
              await supabase.from("messages").insert({
                thread_id: threadId,
                user_id: userId,
                role: "assistant",
                content: responseMessage as never,
              });
              await supabase
                .from("threads")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", threadId);
            } catch (e) {
              console.error("persist assistant failed", e);
            }
          },
        });
      },
    },
  },
});
