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
                <div className="font-medium">Past Spins</div>
              </SidebarMenuButton>
              {spins.length ? (
                <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                  <div className="border border-sidebar-border rounded-md">
                    <div className="max-h-[18rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                      <div className="grid grid-cols-1 divide-x divide-y divide-sidebar-border">
                        {spins.map((spin) => (
                          <SidebarMenuSubItem key={spin.id} className="p-1">
                            <SidebarMenuSubButton asChild>
                              <SpinHoverCard spin={spin}>
                                <Link href={`/spin/${spin.id}`}>
                                  <div className="flex items-center justify-center">
                                    <span className="truncate text-2xl">
                                      {spin.who.emoji}
                                      {spin.what.emoji}
                                      {spin.how.emoji}
                                    </span>
                                  </div>
                                </Link>
                              </SpinHoverCard>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </div>
                    </div>
                  </div>
                </SidebarMenuSub>
              ) : (
                <div className="px-1.5 text-xs text-sidebar-secondary">
                  Start spinning to create your first conversation!
                </div>
              )}

              <SidebarMenuButton asChild>
                <div className="font-medium">Conversations</div>
              </SidebarMenuButton>
              {conversations.length ? (
                <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                  {conversations.map(({ id, spin }, index) => (
                    <SidebarMenuSubItem key={index}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/spin/${spin.id}/conversation/${id}`}>
                          <div className="flex items-center justify-center">
                            <span className="flex items-center gap-2 truncate text-lg">
                              <span className="flex-shrink-0 text-sm">
                                {spin.who.emoji} {spin.who.description}{" "}
                                {spin.what.emoji} {spin.what.description}{" "}
                                {spin.how.emoji}
                                {spin.how.description}
                              </span>
                            </span>
                          </div>
                        </Link>
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
    <HoverCard>
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
