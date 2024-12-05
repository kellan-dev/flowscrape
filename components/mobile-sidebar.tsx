import Link from "next/link";
import Logo from "./logo";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { navigationRoutes } from "@/lib/data";
import { usePathname } from "next/navigation";
import AvailableCreditsBadge from "./available-credits-badge";

export default function MobileSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="mr-8 flex items-center justify-between">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-sm space-y-4" side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Access different sections of FlowScrape
            </SheetDescription>
            <Logo />
            <AvailableCreditsBadge />
            <div className="flex flex-col gap-1">
              {navigationRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={buttonVariants({
                    variant:
                      route.href === pathname
                        ? "sidebarActiveItem"
                        : "sidebarItem",
                  })}
                  onClick={() => setOpen((s) => !s)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
