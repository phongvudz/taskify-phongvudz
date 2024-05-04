"use server";

import { db } from "@/lib/db";
import { DeleteBoard } from "./schema";
import { auth } from "@clerk/nextjs/server";

import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { decreasementAvailiableCount } from "@/lib/org-limit";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Delete a board
  const { id } = validatedData;

  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    await decreasementAvailiableCount();

    await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "DELETE",
    });
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
