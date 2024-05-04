"use server";

import { db } from "@/lib/db";
import { UpdateList } from "./schema";
import { InputType, OutputType } from "./type";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

export const handler = async (
  validatedData: InputType
): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, boardId, title } = validatedData;

  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityType: "LIST",
      entityId: list.id,
      entityTitle: list.title,
      action: "UPDATE",
    });
  } catch (error) {
    return {
      error: "Failed to updated list",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
