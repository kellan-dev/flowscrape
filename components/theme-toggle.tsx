"use client";

import { MoonStar, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeDropdownItems = ["Light", "Dark", "System"];

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-md">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {themeDropdownItems.map((item) => (
          <MenuItem key={item} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuItem({ item }: { item: string }) {
  const { theme, setTheme } = useTheme();

  // https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <DropdownMenuItem
      onClick={() => setTheme(item.toLowerCase())}
      className="cursor-pointer"
    >
      {item}
      {theme === item.toLowerCase() && <Check className="ms-2 size-4" />}
    </DropdownMenuItem>
  );
}
