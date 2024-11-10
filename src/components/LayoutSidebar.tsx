"use client";

import { NavUser } from "@/components/NavUser";
import { useSidebar } from "@/context/SidebarContext";
import { Spin } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shadcn-ui/hover-card";
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
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LayoutSidebar({
  ...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
  const { spins, conversations } = useSidebar();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  }>();
  const [activeTab, setActiveTab] = useState<"conversations" | "spins">(
    "conversations"
  );

  useEffect(() => {
    (async () => {
      const supabase = await createClientSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      setUser({
        id: user.id,
        name: user.email ?? "",
        email: user.email ?? "",
      });
    })();
  }, []);

  return (
    <ShadcnSidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground text-lg">
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
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "conversations"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("conversations")}
            >
              Conversations
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "spins"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("spins")}
            >
              Past Spins
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "conversations" ? (
              conversations.length ? (
                <div className="space-y-2 px-4">
                  {conversations.map(({ id, spin }, index) => (
                    <SpinHoverCard key={index} spin={spin}>
                      <Link href={`/spin/${spin.id}/conversation/${id}`}>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                          <span className="flex items-center gap-2 w-full">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                              {index + 1}
                            </span>
                            <span className="truncate text-2xl">
                              {spin.who.emoji}
                              {spin.what.emoji}
                              {spin.how.emoji}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </SpinHoverCard>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-sidebar-secondary p-4 text-center">
                  You haven&apos;t had any conversations yet.
                </div>
              )
            ) : // Past Spins Tab Content
            spins.length ? (
              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                <div className="space-y-2 px-4">
                  {spins.map((spin, index) => (
                    <SpinHoverCard key={spin.id} spin={spin}>
                      <Link href={`/spin/${spin.id}`}>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                          <span className="flex items-center gap-2 w-full">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                              {index + 1}
                            </span>
                            <span className="truncate text-2xl">
                              {spin.who.emoji}
                              {spin.what.emoji}
                              {spin.how.emoji}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </SpinHoverCard>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-sidebar-secondary p-4 text-center">
                Start spinning to create your first conversation!
              </div>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={user?.name ?? "Guest"}
          email={user?.email ?? "Login to spin!"}
          avatar=""
        />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}

function SpinHoverCard({
  spin,
  children,
}: {
  spin: Spin;
  children: React.ReactNode;
}) {
  return (
    <HoverCard openDelay={100} closeDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardPrimitive.Portal>
        <HoverCardContent
          align="start"
          className="w-80 p-4"
          side="right"
          sideOffset={8}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2 text-3xl">
              <span>{spin.who.emoji}</span>
              <span>{spin.what.emoji}</span>
              <span>{spin.how.emoji}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {spin.who.description} is teaching you about{" "}
              {spin.what.description} {spin.how.description}
            </p>
          </div>
        </HoverCardContent>
      </HoverCardPrimitive.Portal>
    </HoverCard>
  );
}
