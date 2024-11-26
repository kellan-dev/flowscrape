"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/app-node";
import React, { useEffect, useId, useState } from "react";

type EventType =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

export default function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const [internalValue, setInternalValue] = useState(value);
  const id = useId();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let Component: any = Input;

  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="w-full space-y-1 p-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <span className="px-2 text-red-400">*</span>}
      </Label>
      <Component
        id={id}
        className="text-xs"
        value={internalValue}
        disabled={disabled}
        placeholder="Enter value here"
        onChange={(e: EventType) => setInternalValue(e.target.value)}
        onBlur={(e: EventType) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="px-2 text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
}
