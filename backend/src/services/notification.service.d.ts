import type { NotificationType } from "@prisma/client";
type NotifyInput = {
    type: NotificationType;
    title: string;
    message: string;
    href?: string;
    rentalId?: string;
};
export declare const emitNotification: (userIds: Array<string | null | undefined>, input: NotifyInput) => Promise<void>;
export declare const getNotifications: (userId: string, options: {
    unreadOnly?: boolean | undefined;
    limit?: number | undefined;
}) => Promise<{
    id: string;
    type: import("@prisma/client").$Enums.NotificationType;
    title: string;
    message: string;
    href: string | null;
    rentalId: string | null;
    read: boolean;
    createdAt: Date;
    userId: string;
}[]>;
export {};
//# sourceMappingURL=notification.service.d.ts.map