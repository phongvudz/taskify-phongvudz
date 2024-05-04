import { AuditLog, ACTION } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case "CREATE":
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case "UPDATE":
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case "DELETE":
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    case "COPY":
      return `copied ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `performed an action on ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
