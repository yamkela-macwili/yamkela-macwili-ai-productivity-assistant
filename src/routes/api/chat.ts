import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getSystemPrompt, type ChatMode } from "@/lib/prompts";

type Body = {
  messages?: UIMessage[];
  mode?: ChatMode;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = body.messages ?? [];
        const mode: ChatMode = body.mode ?? "general";

        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Bad request", { status: 400 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("AI gateway not configured", { status: 500 });
        }

        const provider = createLovableAiGatewayProvider(apiKey);
        const result = streamText({
          model: provider("google/gemini-2.5-flash"),
          system: getSystemPrompt(mode),
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});
