"use server";

import { db } from "@/lib/db";
import { DeleteCard } from "./schema";
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
  const { id, boardId } = validatedData;

  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        lists: {
          board: {
            orgId,
          },
        },
      },
    });

    await createAuditLog({
      entityType: "CARD",
      entityId: card.id,
      entityTitle: card.title,
      action: "DELETE",
    });
  } catch (error) {
    return {
      error: "Failed to deleted card",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
