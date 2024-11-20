import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import { getWorkflowsForUser } from "@/actions/workflows/get-workflows-for-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import WorkflowCard from "./_components/workflow-card";

export default function WorkflowsPage() {
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  // Alternatively, use try/catch to handle exceptions
  const workflows = await getWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch workflows</AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-4 text-center">
          <p className="text-lg font-bold">
            You haven&apos;t created any workflows yet
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first workflow to get started with FlowScrape!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
