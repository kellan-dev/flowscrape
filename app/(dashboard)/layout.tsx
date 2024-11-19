import React from "react";
import BreadcrumbHeader from "@/components/breadcrumb-header";
import DesktopSidebar from "@/components/desktop-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="container flex h-[50px] items-center justify-between px-6 py-4">
          <BreadcrumbHeader />
          {/* <div className="flex items-center gap-1"> */}
          <ThemeToggle />
          {/* </div> */}
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="container flex-1 py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
