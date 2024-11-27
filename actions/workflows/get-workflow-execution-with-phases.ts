"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

export default async function getWorkflowExecutionWithPhases(
  executionId: string,
) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
