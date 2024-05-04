"use server";

import { db } from "@/lib/db";
import { CreateList } from "./schema";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a list
  const { title, boardId } = validatedData;

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

    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId,
        order: newOrder,
        title,
      },
    });

    await createAuditLog({
      entityType: "LIST",
      entityId: list.id,
      entityTitle: list.title,
      action: "CREATE",
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
