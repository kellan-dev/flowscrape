"use context";

import { AppNodeMissingInputs } from "@/types/app-node";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

export default function FlowValidationContextProvider({
  children,
}: React.PropsWithChildren) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    [],
  );

  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
