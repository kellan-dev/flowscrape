import { WorkflowStatus } from "@/types/workflow";
import prisma from "@/prisma/prisma";
import { getAppUrl } from "@/lib/utils";

export async function GET(req: Request) {
  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `/api/workflows/execute?workflowId=${workflowId}`,
  );

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET_KEY!}`,
    },
    cache: "no-store",
  }).catch((error) =>
    console.error("Failed to trigger workflow", workflowId, ":", error),
  );
}
