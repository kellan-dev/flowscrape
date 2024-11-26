"use client";

import { ParamProps } from "@/types/app-node";
import React from "react";

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.value}</p>;
}
