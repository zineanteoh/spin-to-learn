import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/shadcn-ui/breadcrumb";
import { Separator } from "@/shadcn-ui/separator";
import { SidebarInset, SidebarTrigger } from "@/shadcn-ui/sidebar";
import { ReactNode } from "react";

export function LayoutContainer({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: ReactNode;
}) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>{breadcrumb}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {children}
    </SidebarInset>
  );
}
