"use client";

import { NavUser } from "@/components/NavUser";
import { createScenario, parseSpinResult, Spin } from "@/lib/utils";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shadcn-ui/sidebar";
import { createClientSupabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
  const [spins, setSpins] = useState<Spin[]>([]);
  const [conversations, setConversations] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = await createClientSupabase();
      // select those that have ai_initial_message not equal to null
      const { data, error } = await supabase
        .from("spins")
        .select("*")
        .not("ai_initial_message", "is", null);

      if (!data) return;

      const spinResults = data.map(parseSpinResult);
      setSpins(spinResults);
    })();
  }, []);

  return (
    <ShadcnSidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-lg">
                  🎰
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Spin to Learn!</span>
                  <span className="">Click here to spin!</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="font-medium">
                  Past Spins
                </Link>
              </SidebarMenuButton>
              {spins.length ? (
                <SidebarMenuSub className="ml-0 border-l-0 px-1.5 max-h-[12.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                  {spins.map((spin) => (
                    <SidebarMenuSubItem key={spin.id}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/spin/${spin.id}`}>
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs text-muted-foreground">
                              {spin.who.emoji}
                              {spin.what.emoji}
                              {spin.how.emoji} {createScenario(spin)}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : (
                <div className="px-1.5 text-xs text-sidebar-secondary">
                  Start spinning to create your first conversation!
                </div>
              )}

              {/* TODO:  */}
              <SidebarMenuButton asChild>
                <Link href="/conversation" className="font-medium">
                  Conversations
                </Link>
              </SidebarMenuButton>
              {conversations.length ? (
                <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                  {conversations.map((conversation) => (
                    <SidebarMenuSubItem key={conversation}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/conversation/${conversation}`}>
                          {conversation}
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : (
                <div className="px-1.5 text-xs text-sidebar-secondary">
                  You haven&apos;t had any conversations yet.
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{ name: "Rachel Koh", email: "rachel@koh.com", avatar: "" }}
        />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
