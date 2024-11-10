import "@/app/globals.css";
import { LayoutSidebar } from "@/components/LayoutSidebar";
import { SidebarProvider } from "@/components/shadcn-ui/sidebar";
import type { Metadata } from "next";
import { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Spin To Learn!",
  description: "Spin To Learn!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider
          style={{ "--sidebar-width": "19rem" } as CSSProperties}
        >
          <LayoutSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
