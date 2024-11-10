"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn-ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shadcn-ui/sidebar";
import { createClientSupabase } from "@/utils/supabase/client";
import { ChevronsUpDown, Link, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shadcn-ui/card";

interface NavUserProps {
  name: string;
  email: string;
  avatar: string;
}

export function NavUser({ name, email, avatar }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [name]
  );

  const handleLogout = useCallback(async () => {
    const supabase = await createClientSupabase();
    await supabase.auth.signOut();

    router.push("/login");
    location.reload();
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Card className="shadow-none border-gray-200 bg-transparent mb-2">
          <CardHeader className="p-4 pt-1 pb-2 flex flex-row items-center gap-3 justify-center">
            <img
              src="/hackprinceton.png"
              alt="HackPrinceton"
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col items-center justify-center">
              <CardTitle className="text-sm">
                Built at HackPrinceton 2024
              </CardTitle>
              <CardDescription className="text-xs">
                by{" "}
                <a
                  href="https://www.linkedin.com/in/kohrh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400"
                >
                  Rachel Koh
                </a>{" "}
                &{" "}
                <a
                  href="https://www.linkedin.com/in/zineanteoh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Zi Nean Teoh
                </a>
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {name !== "Guest" && (
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
