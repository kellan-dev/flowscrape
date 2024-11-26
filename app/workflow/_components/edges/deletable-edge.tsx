import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import React from "react";

export default function DeletableEdge(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="size-6 cursor-pointer rounded-full border text-xs leading-none hover:shadow-lg"
            onClick={() =>
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
            }
          >
            X
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
