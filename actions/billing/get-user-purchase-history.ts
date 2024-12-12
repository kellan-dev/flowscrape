"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";

export async function getUserPurchaseHistory() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  return prisma.userPurchase.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
}
