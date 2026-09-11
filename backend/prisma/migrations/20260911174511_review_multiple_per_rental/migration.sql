/*
  Warnings:

  - A unique constraint covering the columns `[rentalId,reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_rentalId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_rentalId_reviewerId_key" ON "Review"("rentalId", "reviewerId");
