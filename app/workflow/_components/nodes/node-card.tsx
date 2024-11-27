"use client";

import useFlowValidationContext from "@/hooks/use-flow-validation-context";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

export default function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidationContext();

  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      className={cn(
        "flex w-[420px] border-separate cursor-pointer flex-col gap-1 rounded-md border-2 bg-background text-xs",
        isSelected && "border-primary",
        hasInvalidInputs && "border-2 border-destructive",
      )}
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;

        const { position, measured } = node;
        if (!position || !measured) return;

        const { x, y } = position;
        if (x === undefined || y === undefined) return;

        const { width, height } = measured;
        if (!width || !height) return;

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        setCenter(centerX, centerY, {
          zoom: 1,
          duration: 500,
        });
      }}
    >
      {children}
    </div>
  );
}
