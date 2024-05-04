"use server";

import { db } from "@/lib/db";
import { UpdateCard } from "./schema";

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

  // Update a card
  const { id, boardId, ...values } = validatedData;

  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        lists: {
          board: { orgId },
        },
      },
      data: {
        ...values,
      },
    });

    await createAuditLog({
      entityType: "CARD",
      entityId: card.id,
      entityTitle: card.title,
      action: "UPDATE",
    });
  } catch (error) {
    return {
      error: "Failed to update board",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
