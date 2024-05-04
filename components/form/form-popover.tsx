"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";

import { FormInput } from "./form-input";
import { FormSubmit } from "./form-button";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { createBoard } from "@/actions/create-board";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface PopoverProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = "bottom",
  sideOffset = 0,
  align,
}: PopoverProps) => {
  const router = useRouter();

  const { onOpen } = useProModal();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const { execute, isLoading, fieldErrors } = useAction(createBoard, {
    onSuccess(board) {
      closeRef.current?.click();
      toast.success("Board created!");
      router.push(`/board/${board.id}`);
    },
    onError(error) {
      toast.error(error);
      closeRef.current?.click();
      onOpen();
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const title = formData.get("title") as string;
      const image = formData.get("image") as string;

      execute({ title, image });
    },
    [execute]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 pt-3 relative"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="text-neutral-600 w-auto h-auto p-2 absolute top-2 right-2"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit disabled={isLoading} className="w-full">
            Create
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
