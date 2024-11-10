"use client";

import { LayoutContainer } from "@/components/LayoutContainer";
import { fetchStream, ItemProp, parseSpinResult } from "@/lib/utils";
import { BreadcrumbPage } from "@/shadcn-ui/breadcrumb";
import { Button } from "@/shadcn-ui/button";
import { Textarea } from "@/shadcn-ui/textarea";
import {
  MessageParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";
import { Dispatch, SetStateAction, useState } from "react";

export function ConversationPage({
  spin: { who, what, how, ai_initial_message },
}: {
  spin: {
    who: ItemProp;
    what: ItemProp;
    how: ItemProp;
    ai_initial_message: string;
  };
}) {
  const [messages, setMessages] = useState<MessageParam[]>(() => [
    {
      role: "assistant",
      content: ai_initial_message,
    } as MessageParam,
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: MessageParam = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput(""); // Clear input field

    setIsLoading(true);

    const stream = await fetchStream("/api/conversation", {
      messages: newMessages,
      who: who.description,
      what: what.description,
      how: how.description,
    });
    const reader = stream?.getReader();

    if (!reader) throw new Error("No reader available");

    // Add a placeholder message for the assistant's response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    // read the stream + update the messages
    processStream(reader, setMessages);

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
}
