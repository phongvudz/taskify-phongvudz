"use server";

import { db } from "@/lib/db";
import { CreateBoard } from "./schema";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import {
  hasAvailiableCount,
  increasementAvailiableCount,
} from "@/lib/org-limit";

const handler = async (validatedData: InputType): Promise<OutputType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreate = await hasAvailiableCount();

  if (!canCreate) {
    return {
      error: "You have reached the maximum number of boards",
    };
  }

  // Create a board
  const { title, image } = validatedData;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Invalid image data. Failed to create board",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
        orgId,
      },
    });

    await increasementAvailiableCount();

    await createAuditLog({
      entityType: "BOARD",
      entityId: board.id,
      entityTitle: board.title,
      action: "CREATE",
    });
  } catch (error) {
    return {
      error: "Failed to create board",
    };
  }

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
