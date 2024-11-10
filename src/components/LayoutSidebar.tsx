"use client";

import { NavUser } from "@/components/NavUser";
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
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";

export function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
  const [conversations, setConversations] = useState<string[]>([]);

  return (
    <ShadcnSidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Spin to Learn!</span>
                  <span className="">See all your past spins</span>
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
                <Link href="/conversation" className="font-medium">
                  Conversations
                </Link>
              </SidebarMenuButton>
              {[].length ? (
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
