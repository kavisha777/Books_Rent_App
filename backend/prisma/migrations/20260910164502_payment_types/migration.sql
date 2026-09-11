/*
  Warnings:

  - Added required pricing columns to existing Book and Rental tables.
  - Existing rows are populated with development values before columns
    are made required.
  - Existing nullable Rental dates are populated before becoming required.
*/

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM (
    'RENTAL',
    'SECURITY_DEPOSIT',
    'REFUND',
    'DAMAGE_CLAIM'
);

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);

-- CreateEnum
CREATE TYPE "ConditionStatus" AS ENUM (
    'GOOD',
    'DAMAGED',
    'LOST',
    'UNVERIFIED'
);

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM (
    'OPEN',
    'UNDER_REVIEW',
    'RESOLVED',
    'REJECTED'
);

-- =========================================================
-- BOOK
-- =========================================================

ALTER TABLE "Book"
ADD COLUMN "dailyRate" DECIMAL(10,2),
ADD COLUMN "securityDeposit" DECIMAL(10,2);

-- Populate existing books with development values.
UPDATE "Book"
SET
    "dailyRate" = 500.00,
    "securityDeposit" = 1000.00
WHERE "dailyRate" IS NULL
   OR "securityDeposit" IS NULL;

-- Make the new columns required.
ALTER TABLE "Book"
ALTER COLUMN "dailyRate" SET NOT NULL,
ALTER COLUMN "securityDeposit" SET NOT NULL;

-- =========================================================
-- RENTAL
-- =========================================================

ALTER TABLE "Rental"
ADD COLUMN "approvedAt" TIMESTAMP(3),
ADD COLUMN "completedAt" TIMESTAMP(3),
ADD COLUMN "confirmedAt" TIMESTAMP(3),
ADD COLUMN "dailyRate" DECIMAL(10,2),
ADD COLUMN "handoverAt" TIMESTAMP(3),
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "rentalAmount" DECIMAL(10,2),
ADD COLUMN "returnedAt" TIMESTAMP(3),
ADD COLUMN "securityDeposit" DECIMAL(10,2);

-- =========================================================
-- EXISTING RENTAL DATES
-- =========================================================

-- Existing development rental records may have NULL dates.
-- Give them a safe one-day period before making the columns required.

UPDATE "Rental"
SET "startDate" = CURRENT_TIMESTAMP
WHERE "startDate" IS NULL;

UPDATE "Rental"
SET "endDate" = "startDate" + INTERVAL '1 day'
WHERE "endDate" IS NULL;

-- =========================================================
-- EXISTING RENTAL PRICING
-- =========================================================

-- Copy the book's current pricing into the rental snapshot.
UPDATE "Rental" r
SET
    "dailyRate" = b."dailyRate",
    "securityDeposit" = b."securityDeposit"
FROM "Book" b
WHERE r."bookId" = b."id";

-- Calculate the existing rental amount.
UPDATE "Rental"
SET "rentalAmount" =
    "dailyRate" *
    GREATEST(
        1,
        CEIL(
            EXTRACT(
                EPOCH FROM ("endDate" - "startDate")
            ) / 86400
        )
    );

-- Make pricing and dates required.
ALTER TABLE "Rental"
ALTER COLUMN "dailyRate" SET NOT NULL,
ALTER COLUMN "rentalAmount" SET NOT NULL,
ALTER COLUMN "securityDeposit" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- =========================================================
-- CONDITION RECORD
-- =========================================================

CREATE TABLE "ConditionRecord" (
    "id" TEXT NOT NULL,
    "status" "ConditionStatus" NOT NULL,
    "notes" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rentalId" TEXT NOT NULL,

    CONSTRAINT "ConditionRecord_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- PAYMENT
-- =========================================================

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rentalId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- DISPUTE
-- =========================================================

CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "evidenceUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rentalId" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- REVIEW
-- =========================================================

CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rentalId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX "ConditionRecord_rentalId_idx"
ON "ConditionRecord"("rentalId");

CREATE INDEX "Payment_rentalId_idx"
ON "Payment"("rentalId");

CREATE INDEX "Payment_status_idx"
ON "Payment"("status");

CREATE INDEX "Payment_type_idx"
ON "Payment"("type");

CREATE INDEX "Payment_providerPaymentId_idx"
ON "Payment"("providerPaymentId");

CREATE INDEX "Dispute_rentalId_idx"
ON "Dispute"("rentalId");

CREATE INDEX "Dispute_raisedById_idx"
ON "Dispute"("raisedById");

CREATE INDEX "Dispute_status_idx"
ON "Dispute"("status");

CREATE UNIQUE INDEX "Review_rentalId_key"
ON "Review"("rentalId");

CREATE INDEX "Review_reviewerId_idx"
ON "Review"("reviewerId");

CREATE INDEX "Review_revieweeId_idx"
ON "Review"("revieweeId");

CREATE INDEX "Review_bookId_idx"
ON "Review"("bookId");

CREATE INDEX "Book_author_idx"
ON "Book"("author");

CREATE INDEX "Rental_paymentStatus_idx"
ON "Rental"("paymentStatus");

CREATE INDEX "Rental_startDate_idx"
ON "Rental"("startDate");

CREATE INDEX "Rental_endDate_idx"
ON "Rental"("endDate");

-- =========================================================
-- FOREIGN KEYS
-- =========================================================

ALTER TABLE "ConditionRecord"
ADD CONSTRAINT "ConditionRecord_rentalId_fkey"
FOREIGN KEY ("rentalId")
REFERENCES "Rental"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_rentalId_fkey"
FOREIGN KEY ("rentalId")
REFERENCES "Rental"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Dispute"
ADD CONSTRAINT "Dispute_rentalId_fkey"
FOREIGN KEY ("rentalId")
REFERENCES "Rental"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Dispute"
ADD CONSTRAINT "Dispute_raisedById_fkey"
FOREIGN KEY ("raisedById")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_rentalId_fkey"
FOREIGN KEY ("rentalId")
REFERENCES "Rental"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_reviewerId_fkey"
FOREIGN KEY ("reviewerId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_revieweeId_fkey"
FOREIGN KEY ("revieweeId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Review"
ADD CONSTRAINT "Review_bookId_fkey"
FOREIGN KEY ("bookId")
REFERENCES "Book"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;