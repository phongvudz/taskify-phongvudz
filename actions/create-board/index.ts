import { db } from "@/lib/db";
import { CreateBoard } from "./schema";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Create a board
  const { title } = validatedData;

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
