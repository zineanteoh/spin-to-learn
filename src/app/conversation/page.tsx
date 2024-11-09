"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/shadcn-ui/breadcrumb";
import { Separator } from "@/shadcn-ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcn-ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/shadcn-ui/button";
import { Textarea } from "@/shadcn-ui/textarea";
import { useState } from "react";
import {
  MessageParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";

// TODO fetch this from database

const emoji = "🐶 🧮 🦴";
const WHO = "Hachiko";
const WHAT = "abacus math";
const HOW = "by gnawing on a bone";
const initialMessage: MessageParam = {
  role: "assistant",
  content: `Ah, welcome to today's lesson. Like this bone, the abacus is simple but incredibly rewarding. 
    Just like how I faithfully waited at Shibuya station each day, we must be patient when learning these calculations. Are you ready to begin?`,
};

export default function Page() {
  const [messages, setMessages] = useState<MessageParam[]>(() => [
    initialMessage,
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
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the full conversation history for context
        body: JSON.stringify(newMessages),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content[0].text,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Optionally handle error in UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <Sidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {emoji} {WHO} is teaching you about {WHAT} {HOW}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
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
              <div className="grid w-full gap-2">
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
      </SidebarInset>
    </SidebarProvider>
  );
}
