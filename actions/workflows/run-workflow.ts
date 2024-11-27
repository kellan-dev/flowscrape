"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { flowToExecutionPlan } from "@/lib/workflow/flow-to-execution-plan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { redirect } from "next/navigation";
import { executeWorkflow } from "@/lib/workflow/execute-workflow";

export default async function runWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const { workflowId, flowDefinition } = form;
  if (!workflowId) throw new Error("Workflow not found");

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");

  let executionPlan: WorkflowExecutionPlan;
  if (!flowDefinition) throw new Error("Flow definition not defined");

  const flow = JSON.parse(flowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("Flow definition is invalid");

  if (!result.executionPlan)
    throw new Error("Failed to generate execution plan");

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      phases: {
        create: executionPlan.flatMap((phase) =>
          phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          }),
        ),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) throw new Error("Failed to create workflow execution");

  executeWorkflow(execution.id); // run this in the background

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
