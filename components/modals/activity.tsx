"use client";

import { AuditLog } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { ActivityIcon } from "lucide-react";
import { ActivityItem } from "../activity-item";

interface ActivityProps {
  data: AuditLog[];
}

export const Activity = ({ data }: ActivityProps) => {
  return (
    <div className="flex w-full gap-x-3 items-start">
      <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {data.map((log) => (
            <ActivityItem log={log} key={log.id} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function SkeletonACtivity() {
  return (
    <div className="flex w-full gap-x-3 items-start">
      <Skeleton className="w-6 h-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 bg-neutral-200" />
      </div>
    </div>
  );
};
