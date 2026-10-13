import prisma from "../lib/prisma.js";
import { emitNotification } from "./notification.service.js";

/*
 * Moves ACTIVE rentals whose end date has passed into OVERDUE.
 * Returns how many were flipped.
 */
export const sweepOverdueRentals = async (): Promise<number> => {
  const overdue = await prisma.rental.findMany({
    where: {
      status: "ACTIVE",
      endDate: {
        lt: new Date(),
      },
    },
    select: {
      id: true,
      renterId: true,
      ownerId: true,
      endDate: true,
      book: {
        select: {
          title: true,
        },
      },
    },
  });

  let flipped = 0;

  for (const rental of overdue) {
    // Filter on status so a concurrent return/lost transition is not clobbered.
    const result = await prisma.rental.updateMany({
      where: {
        id: rental.id,
        status: "ACTIVE",
      },
      data: {
        status: "OVERDUE",
      },
    });

    if (result.count === 0) {
      continue;
    }

    flipped += 1;

    const daysLate = Math.floor(
      (Date.now() - rental.endDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    await emitNotification([rental.renterId, rental.ownerId], {
      type: "OVERDUE",
      title: "Rental overdue",
      message: `"${rental.book.title}" is ${daysLate} day(s) past its return date.`,
      href: `/rentals/${rental.id}`,
      rentalId: rental.id,
    });
  }

  return flipped;
};

export const startOverdueSweeper = (
  intervalMs = 15 * 60 * 1000
): NodeJS.Timeout => {
  const run = async () => {
    try {
      const flipped = await sweepOverdueRentals();

      if (flipped > 0) {
        console.log(`Overdue sweep marked ${flipped} rental(s) OVERDUE`);
      }
    } catch (error) {
      console.error(
        "Overdue sweep failed:",
        error instanceof Error ? error.message : error
      );
    }
  };

  void run();

  const timer = setInterval(() => void run(), intervalMs);

  // Do not keep the process alive for the sweep alone.
  timer.unref();

  return timer;
};
