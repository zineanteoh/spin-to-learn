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
import * as React from "react";

// TODO: replace with actual data
const data = {
  navMain: [
    {
      title: "Past Spins",
      // TODO: replace with actual data
      items: [
        {
          title: "🥷🏻⛅🗡️",
          url: "#",
        },
        {
          title: "🧜‍♀️📐🌊",
          url: "#",
        },
      ],
    },
    {
      title: "Conversations",
      // TODO: replace with actual data
      items: [],
    },
  ],
};

// TODO: clean up + simplify this
export function Sidebar({
  ...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
  return (
    <ShadcnSidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Your Spin History!</span>
                  <span className="">All your past spins</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <div className="font-medium">{item.title}</div>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
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
