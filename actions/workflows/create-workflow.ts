"use server";

import { createFlowNode } from "@/lib/workflow/create-flow-node";
import prisma from "@/prisma/prisma";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schemas/workflow";
import { AppNode } from "@/types/app-node";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function createWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) throw new Error("Invalid form data");

  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) throw new Error("Failed to create workflow");

  redirect(`/workflow/editor/${result.id}`);
}
