import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParamField from "./node-param-field";
import { colorForHandle } from "./common";

export function NodeInputs({ children }: React.PropsWithChildren) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name,
  );

  return (
    <div className="relative flex w-full justify-start bg-secondary p-3">
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!-left-2 !size-4 !border-2 !border-background !bg-muted-foreground",
            colorForHandle[input.type],
          )}
        />
      )}
    </div>
  );
}
