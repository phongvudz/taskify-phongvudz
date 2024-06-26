"use server";

import { db } from "@/lib/db";
import { UpdateBoard } from "./schema";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a board
  const { title, id } = validatedData;

  let board;

  try {
    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "UPDATE",
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }

  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
