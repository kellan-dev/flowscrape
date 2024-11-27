"use client";

import {
  flowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/flow-to-execution-plan";
import { AppNode } from "@/types/app-node";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidationContext from "./use-flow-validation-context";
import { toast } from "sonner";

export default function useExecutionPlan() {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidationContext();

  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("There is no entry point in the flow");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("There are invalid input values in the flow");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("Failed to generate execution plan");
          break;
      }
    },
    [setInvalidInputs],
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionPlan, error } = flowToExecutionPlan(
      nodes as AppNode[],
      edges,
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
}
