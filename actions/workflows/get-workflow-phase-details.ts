"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

export default async function getWorkflowPhaseDetails(phaseId: string) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
  });
}
