"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";

import { CardWithList } from "@/types";

import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModalStore } from "@/hooks/use-card-modal";
import { useCallback } from "react";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();

  const onClose = useCardModalStore((state) => state.onClose);

  const { execute: executeCopyCard, isLoading: isPendingCopy } = useAction(
    copyCard,
    {
      onSuccess(data) {
        toast.success(`Copied to "${data.title}"`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isPendingDelete } = useAction(
    deleteCard,
    {
      onSuccess(data) {
        toast.success(`Copied to "${data.title}"`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const handleCopy = useCallback(() => {
    executeCopyCard({ id: data.id, boardId: params.boardId as string });
  }, [data.id, executeCopyCard, params.boardId]);

  const handleDelete = useCallback(() => {
    executeDeleteCard({ id: data.id, boardId: params.boardId as string });
  }, [data.id, executeDeleteCard, params.boardId]);

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        className="w-full justify-start"
        size="inline"
        variant="gray"
        onClick={handleCopy}
        disabled={isPendingCopy}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        className="w-full justify-start"
        size="inline"
        variant="gray"
        onClick={handleDelete}
        disabled={isPendingDelete}
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function SkeletonActions() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
