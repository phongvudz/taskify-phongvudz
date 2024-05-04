import Link from "next/link";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HelpCircle, User2 } from "lucide-react";

import { Hint } from "@/components/hint";
import { FormPopover } from "@/components/form/form-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailiableCount } from "@/lib/org-limit";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { checkSubscription } from "@/lib/subscription";

export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect(`/select-org`);
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const availableCount = await getAvailiableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="w-6 h-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-col-4 gap-4">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{
              backgroundImage: `url(${board.imageFullUrl})`,
            }}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
          >
            <div className="absolute bg-black/30  inset-0 transition group-hover:bg-black/40" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        <FormPopover sideOffset={10} side="right">
          <div
            className="relative aspect-video h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center  justify-center hover:opacity-75 transition"
            role="button"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro ? "Unlimited" : MAX_FREE_BOARDS - availableCount} remaining
            </span>
            <Hint
              sidOffset={60}
              description={`
            Free workspaces can have up to 5 boards. For unlimited boards, upgrade to a paid plan.  
          `}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <Skeleton className="w-6 h-6 mr-2" />
        <Skeleton className=" w-32 h-6" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-col-4 gap-4">
        <Skeleton className="aspect-video w-full h-full p-2" />
        <Skeleton className="aspect-video w-full h-full p-2" />
        <Skeleton className="aspect-video w-full h-full p-2" />
        <Skeleton className="aspect-video w-full h-full p-2" />
        <Skeleton className="aspect-video w-full h-full p-2" />
      </div>
    </div>
  );
};
