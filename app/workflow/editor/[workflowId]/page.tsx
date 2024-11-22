import { auth } from "@clerk/nextjs/server";
import React from "react";
import prisma from "@/prisma/prisma";
import Editor from "../../_components/editor";

type Props = {
  // Params becomes async in Next 15: Promise<{ workflowId: string }>;
  params: {
    workflowId: string;
  };
};

export default async function EditorPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return <div>Not authenticated</div>;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: params.workflowId,
      userId,
    },
  });

  if (!workflow) return <div>Workflow not found</div>;

  return <Editor workflow={workflow} />;
}
