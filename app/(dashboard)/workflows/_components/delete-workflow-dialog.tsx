"use client";

import { deleteWorkflow } from "@/actions/workflows/delete-workflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowName: string;
};

export default function DeleteWorkflowDialog({
  isOpen,
  setIsOpen,
  workflowId,
  workflowName,
}: Props) {
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully!", {
        id: workflowId,
      });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Failed to delete workflow", {
        id: workflowId,
      });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="size-6" />
            <AlertDialogTitle>Delete this workflow?</AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            This action is permanent and cannot be undone. Are you sure you want
            to delete this workflow?
            <div className="flex flex-col gap-2 py-4">
              <p>
                Enter <b>{`"${workflowName}"`}</b> below to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting workflow...", {
                id: workflowId,
              });
              deleteMutation.mutate(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
