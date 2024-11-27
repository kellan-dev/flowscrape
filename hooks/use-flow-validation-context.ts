"use client";

import { FlowValidationContext } from "@/contexts/flow-validation-context";
import { useContext } from "react";

export default function useFlowValidationContext() {
  const context = useContext(FlowValidationContext);

  if (!context) {
    throw new Error(
      "useFlowValidationContext must be used within a FlowValidationContextProvider",
    );
  }

  return context;
}
