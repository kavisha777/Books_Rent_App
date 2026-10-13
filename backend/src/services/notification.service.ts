import type { NotificationType } from "@prisma/client";

import prisma from "../lib/prisma.js";

type NotifyInput = {
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  rentalId?: string;
};

/*
 * Never await this inside a transaction or let it reject: a notification
 * failure must not fail the business operation that triggered it.
 */
export const emitNotification = async (
  userIds: Array<string | null | undefined>,
  input: NotifyInput
): Promise<void> => {
  const recipients = Array.from(
    new Set(userIds.filter((id): id is string => Boolean(id)))
  );

  if (recipients.length === 0) {
    return;
  }

  try {
    await prisma.notification.createMany({
      data: recipients.map((userId) => ({
        userId,
        ...input,
      })),
    });
  } catch (error) {
    console.error(
      "Notification delivery failed:",
      error instanceof Error ? error.message : error
    );
  }
};

export const getNotifications = async (
  userId: string,
  options: {
    unreadOnly?: boolean | undefined;
    limit?: number | undefined;
  }
) => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(options.unreadOnly ? { read: false } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Math.min(options.limit ?? 50, 200),
  });
};
