"use client";
import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { ElementRef, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";

type Props = {
  data: List;
  onAddCard: () => void;
};

const ListHeader = ({ data, onAddCard }: Props) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess(data) {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
  });

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTitle(data.title);
        disableEditing();
      }
    },
    [data.title, disableEditing]
  );

  const onBlur = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const id = formData.get("id") as string;
      const reqTitle = formData.get("title") as string;
      const boardId = formData.get("boardId") as string;

      if (reqTitle === title) {
        disableEditing();
        return;
      }

      execute({ id, title: reqTitle, boardId });
    },
    [disableEditing, execute, title]
  );

  useEventListener("keydown", onKeydown);

  return (
    <div className="p-2 pb-0 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="px-[2px] flex-1">
          <input className="hidden" id="id" name="id" value={data.id} />
          <input
            className="hidden"
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormInput
            errors={fieldErrors}
            onBlur={onBlur}
            id="title"
            ref={inputRef}
            defaultValue={title}
            placeholder="Enter list title..."
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input  transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};

export default ListHeader;
