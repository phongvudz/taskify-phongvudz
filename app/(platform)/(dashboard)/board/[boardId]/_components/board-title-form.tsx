"use client";

import { toast } from "sonner";
import { Board } from "@prisma/client";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { updateBoard } from "@/actions/update-board";
import { FormInput } from "@/components/form/form-input";
import { ElementRef, useCallback, useRef, useState } from "react";

interface BoardTitleFormProps {
  board: Board;
}

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess(board) {
      toast.success(`Board "${board.title}" updated!`);
      disableEditing();
      setTitle(board.title);
    },
    onError(error) {
      toast.error(error);
      toast.error("Failed to update board");
    },
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [title, setTitle] = useState<string>(board.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const reqTitle = formData.get("title") as string;

      if (reqTitle === title) {
        disableEditing();
        return;
      }

      execute({ title: reqTitle, id: board.id });
    },
    [board.id, disableEditing, execute, title]
  );

  const onBlur = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent  focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      onClick={enableEditing}
    >
      {title}
    </Button>
  );
};
