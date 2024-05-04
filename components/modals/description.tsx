"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ElementRef, useCallback, useRef, useState } from "react";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/components/form/form-button";
import { FormTextarea } from "@/components/form/form-textarea";

interface DescriptionsProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionsProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const { execute } = useAction(updateCard, {
    onSuccess(data) {
      queryClient.invalidateQueries(["card", data.id]);
      queryClient.invalidateQueries(["card-logs", data.id]);
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const [isEdit, setIsEdit] = useState(false);

  const enableEditing = useCallback(() => {
    setIsEdit(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEdit(false);
  }, []);

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing]
  );

  useEventListener("keydown", onKeydown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const id = data.id;
      const boardId = params.boardId as string;
      const description = formData.get("description") as string;

      if (!description || description === data.description) return;

      execute({
        id,
        boardId,
        description,
      });
    },
    [data.description, data.id, execute, params.boardId]
  );

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Desciption</p>
        {isEdit ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              ref={textareaRef}
              className="w-full mt-2"
              defaultValue={data.description || undefined}
              placeholder="Add a more detailed description..."
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit className="">Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 px-3.5 text-sm font-medium py-3 rounded-md"
            role="button"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function SkeletonDescription() {
  return (
    <div className=" flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px]  bg-neutral-200" />
      </div>
    </div>
  );
};
