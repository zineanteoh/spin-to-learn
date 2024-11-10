import { ConversationPage } from "@/components/ConversationPage";
import { PageProps, parseSpinResult } from "@/lib/utils";
import { createServerSupabase } from "@/utils/supabase/server";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: PageProps<"spinId" | "conversationId">) {
  const { spinId, conversationId } = await params;

  if (!spinId || !conversationId) {
    redirect("/");
  }

  const supabase = await createServerSupabase();

  // Fetch the spin
  const { data: spin } = await supabase
    .from("spins")
    .select("*")
    .eq("id", spinId)
    .single();

  if (!spin) {
    redirect("/");
  }

  // Fetch the messages from the conversation
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (!messages) {
    redirect("/");
  }

  const spinResult = parseSpinResult(spin);

  const messageParams: MessageParam[] = messages.map((message) => ({
    role: message.creator_id ? "user" : "assistant",
    content: message.content ?? "",
  }));

  return (
    <ConversationPage
      spin={spinResult}
      convoId={conversationId}
      initialMessages={messageParams}
    />
  );
}
