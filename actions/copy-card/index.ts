"use server";

import { db } from "@/lib/db";
import { CopyCard } from "./schema";
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
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        lists: {
          board: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return {
        error: "Card not found",
      };
    }

    const lastCard = await db.card.findFirst({
      where: {
        id,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        order: newOrder,
        title: `${cardToCopy.title} - Copy`,
        listId: cardToCopy.listId,
      },
    });

    await createAuditLog({
      entityType: "CARD",
      entityId: card.id,
      entityTitle: card.title,
      action: "COPY",
    });
  } catch (error) {
    return {
      error: "Failed to copied card",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
