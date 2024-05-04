import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
  entityType: ENTITY_TYPE;
  entityId: string;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  const { orgId } = auth();
  const user = await currentUser();

  if (!user || !orgId) {
    throw new Error("User or orgId not found");
  }

  const { entityId, entityTitle, entityType, action } = props;

  await db.auditLog.create({
    data: {
      orgId,
      entityId,
      entityType,
      entityTitle,
      action,
      userId: user?.id,
      userImage: user?.imageUrl,
      userName: user?.firstName + " " + user?.lastName,
    },
  });

  try {
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
