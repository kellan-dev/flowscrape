"use client";

import Logo from "./logo";
import Link from "next/link";
import useActiveRoute from "@/hooks/use-active-route";
import { buttonVariants } from "./ui/button";
import { navigationRoutes } from "@/lib/data";

export default function DesktopSidebar() {
  const activeRoute = useActiveRoute();

  return (
    <div className="relative hidden h-screen w-full min-w-[280px] max-w-[280px] border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block">
      <div className="flex border-separate items-center justify-center gap-2 border-b-[1px] p-4">
        <Logo />
      </div>
      <div className="p-2">TODO CREDITS</div>
      <div className="flex flex-col p-2">
        {navigationRoutes.map((route) => (
          // Link styled to look like a Button via the buttonVariants cva function.
          // Alternatively, a more idiomatic approach would be to use a Button with asChild prop.
          <Link
            key={route.href}
            href={route.href}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarActiveItem"
                  : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
