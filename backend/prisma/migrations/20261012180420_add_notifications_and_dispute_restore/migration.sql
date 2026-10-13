-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RENTAL_REQUEST', 'APPROVED', 'REJECTED', 'CANCELLED', 'PAYMENT', 'HANDOVER', 'RETURN', 'COMPLETED', 'OVERDUE', 'LOST', 'DISPUTE', 'REVIEW');

-- AlterTable
ALTER TABLE "Dispute" ADD COLUMN     "previousRentalStatus" "RentalStatus";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "rentalId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
