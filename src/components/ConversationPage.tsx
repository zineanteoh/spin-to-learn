"use client";

import { LayoutContainer } from "@/components/LayoutContainer";
import { fetchStream, Spin } from "@/lib/utils";
import { BreadcrumbPage } from "@/shadcn-ui/breadcrumb";
import { Button } from "@/shadcn-ui/button";
import { Textarea } from "@/shadcn-ui/textarea";
import { createClientSupabase } from "@/utils/supabase/client";
import {
  MessageParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export function ConversationPage({
  spin: { id, who, what, how, ai_initial_message },
  convoId,
  initialMessages = [
    {
      role: "assistant",
      content: ai_initial_message ?? "",
    },
  ],
}: {
  spin: Spin;
  convoId?: string;
  initialMessages?: MessageParam[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageParam[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createConversation = useCallback(async (spinId: string) => {
    const supabase = await createClientSupabase();

    const { data: conversation } = await supabase
      .from("conversations")
      .insert({ spin_id: spinId })
      .select("*")
      .single();
    return conversation;
  }, []);

  const saveAIInitialMessage = useCallback(
    async (conversationId: string) => {
      const supabase = await createClientSupabase();
      await supabase.from("messages").insert({
        content: ai_initial_message ?? "",
        conversation_id: conversationId,
      });
    },
    [ai_initial_message]
  );

  const saveMessages = useCallback(
    async (conversationId: string, message: string) => {
      const supabase = await createClientSupabase();
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("messages").insert({
        creator_id: user?.user?.id,
        content: message,
        conversation_id: conversationId,
      });
      return error;
    },
    []
  );

  const handleSend = async () => {
    if (input.trim() === "") return;

    // create a conversation if this is the first message
    let conversationId: string | null = null;
    if (messages.length === 1) {
      const conversation = await createConversation(id);
      await saveAIInitialMessage(conversation?.id ?? "");
      if (!conversation) throw new Error("Failed to create conversation");
      conversationId = conversation.id;
      window.history.replaceState(
        null,
        "",
        `/spin/${id}/conversation/${conversation.id}`
      );
    }

    // Add user message
    const userMessage: MessageParam = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput(""); // Clear input field

    // save the messages to db
    await saveMessages(conversationId ?? convoId ?? "", input.trim());

    setIsLoading(true);

    const stream = await fetchStream("/api/conversation", {
      messages: newMessages,
      conversationId: conversationId ?? convoId ?? "",
      who: who.description,
      what: what.description,
      how: how.description,
    });
    const reader = stream?.getReader();

    if (!reader) throw new Error("No reader available");

    // Add a placeholder message for the assistant's response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    // read the stream + update the messages
    await processStream(reader, setMessages);

    setIsLoading(false);
  };

  return (
    <LayoutContainer
      breadcrumb={
        <BreadcrumbPage>
          {who.emoji}
          {what.emoji}
          {how.emoji} | {who.description} is teaching you about{" "}
          {what.description} {how.description}
        </BreadcrumbPage>
      }
    >
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isAssistantMessage = msg.role === "assistant";
              const content =
                typeof msg.content === "string"
                  ? msg.content
                  : (msg.content as unknown as TextBlockParam).text;

              return (
                <div
                  key={index}
                  className={`flex ${
                    isAssistantMessage ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-md ${
                      isAssistantMessage
                        ? "bg-gray-200"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-shrink-0 border-t bg-background shadow-lg z-10">
          <div className="p-4">
            <div className="flex gap-3 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 h-[2.9em] min-h-[2.9em] max-h-[20em]"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg sm:px-3 sm:py-1"
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
}

async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  setMessages: Dispatch<SetStateAction<MessageParam[]>>
) {
  let accumulatedContent = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode and parse the chunk
    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          // Concatenate the new text instead of replacing
          accumulatedContent += data.text || "";

          // Update the last message with accumulated content
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: accumulatedContent,
            };
            return newMessages;
          });
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      }
    }
  }
  return accumulatedContent;
}
