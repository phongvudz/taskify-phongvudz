"use server";

import { db } from "@/lib/db";
import { UpdateCardOrder } from "./schema";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // Update card order
  const { items, boardId } = validatedData;

  let cards;

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          lists: {
            board: {
              orgId,
            },
          },
          id: card.id,
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    cards = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: cards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
