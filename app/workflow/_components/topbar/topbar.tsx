"use client";

import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./save-btn";

export default function Topbar({
  title,
  subtitle,
  workflowId,
}: {
  title: string;
  subtitle?: string;
  workflowId: string;
}) {
  const router = useRouter();
  return (
    <header className="border-p-2 sticky top-0 z-10 flex h-[60px] w-full border-separate justify-between bg-background p-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate text-ellipsis font-bold">{title}</p>
          {subtitle && (
            <p className="truncate text-ellipsis text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-1">
        <SaveBtn workflowId={workflowId} />
      </div>
    </header>
  );
}
