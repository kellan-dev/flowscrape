"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { unpublishWorkflow } from "@/actions/workflows/unpublish-workflow";

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: "workflowId" });
    },
    onError: () => {
      toast.error("Failed to unpublish workflow", { id: "workflowId" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: "workflowId" });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      Unpublish
    </Button>
  );
}
