import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ChatMode } from "./prompts";

const ModeSchema = z.enum(["general", "email", "notes", "planner", "research"]);

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("threads")
      .select("id, title, mode, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        mode: ModeSchema.default("general"),
        title: z.string().min(1).max(120).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("threads")
      .insert({
        user_id: userId,
        mode: data.mode,
        title: data.title ?? "New chat",
      })
      .select("id, title, mode")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Failed to create thread");
    return row;
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), title: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("threads")
      .update({ title: data.title, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase.from("threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: thread, error } = await supabase
      .from("threads")
      .select("id, title, mode")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!thread) throw new Error("Thread not found");

    const { data: msgs, error: mErr } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("thread_id", data.id)
      .order("created_at", { ascending: true });
    if (mErr) throw new Error(mErr.message);

    return {
      thread: { ...thread, mode: thread.mode as ChatMode },
      messages: msgs ?? [],
    };
  });
