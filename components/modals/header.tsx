"use client";

import { ElementRef, useCallback, useRef, useState } from "react";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "react-query";

import { CardWithList } from "@/types";

import { FormInput } from "../form/form-input";
import { Skeleton } from "../ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);

  const { execute } = useAction(updateCard, {
    onSuccess(data) {
      queryClient.invalidateQueries(["card", data.id]);
      queryClient.invalidateQueries(["card-logs", data.id]);
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onBlur = useCallback(() => {
    inputRef.current?.form?.requestSubmit();
  }, []);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      const boardId = params.boardId as string;
      const id = data.id;

      execute({ id, boardId, title });
    },
    [data.id, execute, params.boardId]
  );

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            id="title"
            onBlur={onBlur}
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent borde-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.lists.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function SkeletonHeader() {
  return (
    <div className="flex items-center gap-x-3 mb-6">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div className="space-y-1">
        <Skeleton className="w-24 h-6 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
