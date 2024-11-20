"use server";

import prisma from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflowsForUser() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
