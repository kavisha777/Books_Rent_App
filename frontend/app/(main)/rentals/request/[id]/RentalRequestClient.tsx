
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';

import { apiRequest } from '../../../../../lib/api';
import { getAccessToken } from '../../../../../lib/auth';

type Book = {
  id: string;
  title: string;
  author?: string;
  category?: string;
  dailyRate: number;
  securityDeposit: number;
  pickupLocation?: string;
  status?: string;
  coverImage?: string;
  imageUrl?: string;
};

type BookResponse = {
  success?: boolean;
  message?: string;
  data?: { book?: Book };
  book?: Book;
};

type RentalResponse = {
  success?: boolean;
  message?: string;
  data?: {
    rental?: { id?: string };
    id?: string;
  };
  rental?: { id?: string };
  id?: string;
};

type AvailabilityResponse = {
  success?: boolean;
  message?: string;
  data?: {
    bookedDates?: {
      startDate: string;
      endDate: string;
    }[];
  };
};

type BookedRange = {
  startDate: string;
  endDate: string;
};

function extractBook(response: BookResponse): Book | null {
  return response.book || response.data?.book || null;
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

function formatDate(key: string): string {
  if (!key) return 'Select date';

  return parseDateKey(key).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function calculateDays(start: string, end: string): number {
  if (!start || !end) return 0;

  const startDate = parseDateKey(start);
  const endDate = parseDateKey(end);

  return Math.round(
    (Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ) -
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      )) /
      86400000,
  );
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

function extractBookedRanges(
  response: AvailabilityResponse,
): BookedRange[] {
  if (!response.success || !response.data?.bookedDates) {
    throw new Error(
      response.message || 'Unable to load book availability.',
    );
  }

  return response.data.bookedDates.map((range) => ({
    startDate: range.startDate.slice(0, 10),
    endDate: range.endDate.slice(0, 10),
  }));
}

export default function RentalRequestClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookId = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 12);
  });

  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState('');
  const [retryAvailability, setRetryAvailability] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = dateKey(new Date());
  const earliestDate = addDays(today, 1);
  const duration = calculateDays(startDate, endDate);

  const rentalAmount = useMemo(
    () =>
      book && duration > 0
        ? Number(book.dailyRate) * duration
        : 0,
    [book, duration],
  );

  const securityDeposit = book
    ? Number(book.securityDeposit)
    : 0;

  const totalAmount = rentalAmount + securityDeposit;

  useEffect(() => {
    let mounted = true;

    async function loadBook() {
      try {
        setLoading(true);

        const response = await apiRequest<BookResponse>(
          `/books/${bookId}`,
        );

        const loadedBook = extractBook(response);

        if (!mounted) return;

        if (!loadedBook) {
          setError('Book information could not be found.');
          return;
        }

        setBook(loadedBook);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load this book.',
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadBook();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  useEffect(() => {
    let mounted = true;

    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError('');

        const response = await apiRequest<AvailabilityResponse>(
          `/rentals/availability/${bookId}`,
        );

        const ranges = extractBookedRanges(response);

        if (!mounted) return;

        setBookedRanges(ranges);
      } catch (err) {
        if (!mounted) return;

        setAvailabilityError(
          err instanceof Error
            ? err.message
            : 'Unable to check booked dates.',
        );
      } finally {
        if (mounted) setAvailabilityLoading(false);
      }
    }

    if (bookId) void loadAvailability();

    return () => {
      mounted = false;
    };
  }, [bookId, retryAvailability]);

  function isOccupied(day: string): boolean {
    return bookedRanges.some(
      (range) =>
        day >= range.startDate && day < range.endDate,
    );
  }

  function rangeHasConflict(start: string, end: string): boolean {
    return bookedRanges.some(
      (range) =>
        range.startDate < end && range.endDate > start,
    );
  }

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1, 12);
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = (firstDay.getDay() + 6) % 7;

    return [
      ...Array.from({ length: leadingBlanks }, () => ''),
      ...Array.from({ length: numberOfDays }, (_, index) =>
        dateKey(new Date(year, month, index + 1, 12)),
      ),
    ];
  }, [calendarMonth]);

  function isDayDisabled(day: string): boolean {
    if (
      !day ||
      day < earliestDate ||
      availabilityLoading ||
      Boolean(availabilityError)
    ) {
      return true;
    }

    // Select a pickup date.
    if (!startDate || endDate) {
      return isOccupied(day);
    }

    // Select a return date after pickup.
    if (day <= startDate) return true;

    return rangeHasConflict(startDate, day);
  }

  function handleDateClick(day: string) {
    if (!day || isDayDisabled(day)) return;

    setError('');

    if (!startDate || endDate) {
      setStartDate(day);
      setEndDate('');
      return;
    }

    setEndDate(day);

    // Close the popup after both dates have been selected.
    setCalendarOpen(false);
  }

  function resetDates() {
    setStartDate('');
    setEndDate('');
    setError('');
    setCalendarOpen(true);
  }

  async function handleRequest() {
    setError('');

    if (!getAccessToken()) {
      setError('Please sign in before requesting a rental.');
      return;
    }

    if (!book) {
      setError('Book information is unavailable.');
      return;
    }

    if (availabilityLoading) {
      setError('Please wait while we check availability.');
      return;
    }

    if (availabilityError) {
      setError('Availability could not be verified. Please try again.');
      return;
    }

    if (!startDate || !endDate || duration <= 0) {
      setError('Please select both pickup and return dates.');
      setCalendarOpen(true);
      return;
    }

    if (startDate < earliestDate) {
      setError('Please select a future pickup date.');
      setCalendarOpen(true);
      return;
    }

    if (rangeHasConflict(startDate, endDate)) {
      setError('These dates conflict with another rental.');
      setCalendarOpen(true);
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest<RentalResponse>('/rentals', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          bookId: book.id,
          startDate: parseDateKey(startDate).toISOString(),
          endDate: parseDateKey(endDate).toISOString(),
          rentalAmount,
          securityDeposit,
        }),
      });

      setSuccess(true);

      window.setTimeout(() => {
        router.push('/rentals');
        router.refresh();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create the rental request.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] px-4 py-10">
        <div className="bl-container">
          <div className="mx-auto max-w-4xl animate-pulse">
            <div className="mb-8 h-5 w-28 rounded bg-[var(--cream)]" />
            <div className="bl-card h-[520px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-[calc(100vh-72px)] px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="bl-card p-8 text-center">
            <h1 className="text-3xl">Unable to load rental</h1>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">
              {error || 'The requested book could not be found.'}
            </p>
            <Link
              href="/explore"
              className="bl-button bl-button-primary mt-6"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-[calc(100vh-72px)] px-4 py-12">
        <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center">
          <div className="bl-card w-full p-8 text-center sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-soft)]">
              <CheckCircle2
                size={34}
                className="text-[var(--green)]"
              />
            </div>
            <h1 className="text-3xl">Rental request sent</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
              Your request for <strong>{book.title}</strong> has been
              submitted to the owner.
            </p>
            <div className="mt-6 rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm font-semibold text-[var(--navy)]">
              Opening My Rentals...
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] pb-28 lg:pb-12">
      <div className="bl-container pt-5 sm:pt-8">
        <Link
          href={`/book/${book.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--navy)]"
        >
          <ArrowLeft size={17} />
          Back to book
        </Link>

        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Rental request
          </p>
          <h1 className="text-4xl sm:text-5xl">
            Borrow it, read it, return it.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
            Choose your rental dates and send a request to the book owner.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="bl-card p-5 sm:p-7">
            <div className="flex gap-4 border-b border-[var(--border)] pb-6">
              <div className="book-cover cover-one h-28 w-20 shrink-0">
                <div className="book-cover-content p-2">
                  <p className="text-[9px] font-bold uppercase tracking-wide">
                    BookLoop
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-tight">
                    {book.title}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--gold)]">
                  {book.category || 'Book'}
                </p>
                <h2 className="mt-1 text-2xl">{book.title}</h2>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  by {book.author || 'Unknown author'}
                </p>

                {book.pickupLocation && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-soft)]">
                    <MapPin size={14} />
                    {book.pickupLocation}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <h2 className="mb-4 text-xl">Rental details</h2>

              {/* Clicking this field opens the calendar popup. */}
              <div className="relative">
                <label className="mb-2 block text-sm font-bold text-[var(--navy)]">
                  Rental Duration
                </label>

                <button
                  type="button"
                  aria-expanded={calendarOpen}
                  aria-haspopup="dialog"
                  onClick={() => {
                    setError('');
                    setCalendarOpen((open) => !open);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 text-left transition hover:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CalendarDays
                      size={21}
                      className="shrink-0 text-[var(--gold)]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--navy)]">
                        {duration > 0
                          ? `${duration} days`
                          : 'Select rental dates'}
                      </p>
                      <p className="mt-1 text-xs text-[var(--ink-soft)]">
                        {startDate && endDate
                          ? `${formatDate(startDate)} – ${formatDate(endDate)}`
                          : 'Choose pickup and return dates'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={19}
                    className={`shrink-0 text-[var(--ink-soft)] transition ${
                      calendarOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {/* Calendar popup stays on this page. */}
                {calendarOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close calendar"
                      onClick={() => setCalendarOpen(false)}
                      className="fixed inset-0 z-40 cursor-default bg-black/20"
                    />

                    <div
                      role="dialog"
                      aria-label="Choose rental dates"
                      className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-2xl sm:p-5"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[var(--navy)]">
                            Choose rental dates
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                            {!startDate || endDate
                              ? 'Step 1: Select your pickup date.'
                              : 'Step 2: Select your return date.'}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label="Close calendar"
                          onClick={() => setCalendarOpen(false)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--offwhite)]"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mb-4 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          aria-label="Previous month"
                          onClick={() =>
                            setCalendarMonth(
                              (current) =>
                                new Date(
                                  current.getFullYear(),
                                  current.getMonth() - 1,
                                  1,
                                  12,
                                ),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] hover:bg-[var(--offwhite)]"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <h4 className="text-sm font-bold text-[var(--navy)]">
                          {monthLabel(calendarMonth)}
                        </h4>

                        <button
                          type="button"
                          aria-label="Next month"
                          onClick={() =>
                            setCalendarMonth(
                              (current) =>
                                new Date(
                                  current.getFullYear(),
                                  current.getMonth() + 1,
                                  1,
                                  12,
                                ),
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] hover:bg-[var(--offwhite)]"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                          (day) => (
                            <div
                              key={day}
                              className="py-2 text-[10px] font-bold text-[var(--ink-soft)] sm:text-xs"
                            >
                              {day}
                            </div>
                          ),
                        )}

                        {calendarCells.map((day, index) => {
                          if (!day) {
                            return <div key={`blank-${index}`} />;
                          }

                          const disabled = isDayDisabled(day);
                          const isStart = day === startDate;
                          const isEnd = day === endDate;
                          const isBetween =
                            Boolean(startDate && endDate) &&
                            day > startDate &&
                            day < endDate;
                          const occupied = isOccupied(day);

                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={disabled}
                              onClick={() => handleDateClick(day)}
                              aria-label={`${formatDate(day)}${
                                occupied ? ', booked' : ''
                              }`}
                              aria-pressed={isStart || isEnd}
                              title={
                                occupied
                                  ? 'Already booked'
                                  : disabled
                                    ? 'Unavailable for this selection'
                                    : `Select ${formatDate(day)}`
                              }
                              className={[
                                'flex aspect-square min-h-8 items-center justify-center rounded-lg text-xs font-semibold transition sm:text-sm',
                                isStart || isEnd
                                  ? 'bg-[var(--navy)] text-white'
                                  : isBetween
                                    ? 'bg-[var(--cream)] text-[var(--navy)]'
                                    : disabled
                                      ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                                      : 'text-[var(--navy)] hover:bg-[var(--cream)]',
                                occupied && !isStart && !isEnd
                                  ? 'line-through'
                                  : '',
                              ].join(' ')}
                            >
                              {Number(day.slice(-2))}
                            </button>
                          );
                        })}
                      </div>

                      {availabilityLoading && (
                        <p className="mt-3 text-xs text-[var(--ink-soft)]">
                          Checking booked dates...
                        </p>
                      )}

                      {availabilityError && (
                        <div className="mt-3 rounded-xl bg-[var(--red-soft)] p-3 text-xs leading-5 text-[var(--red)]">
                          {availabilityError}
                          <button
                            type="button"
                            onClick={() =>
                              setRetryAvailability((value) => value + 1)
                            }
                            className="ml-1 font-bold underline"
                          >
                            Try again
                          </button>
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-4">
                        <div className="rounded-xl bg-[var(--offwhite)] p-3">
                          <p className="text-[10px] font-bold uppercase text-[var(--ink-soft)]">
                            Pickup
                          </p>
                          <p className="mt-1 text-xs font-bold text-[var(--navy)]">
                            {formatDate(startDate)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[var(--offwhite)] p-3">
                          <p className="text-[10px] font-bold uppercase text-[var(--ink-soft)]">
                            Return
                          </p>
                          <p className="mt-1 text-xs font-bold text-[var(--navy)]">
                            {formatDate(endDate)}
                          </p>
                        </div>
                      </div>

                      {startDate && endDate && (
                        <button
                          type="button"
                          onClick={resetDates}
                          className="mt-3 text-xs font-bold text-[var(--navy)] underline underline-offset-4"
                        >
                          Choose different dates
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Selected dates remain visible after the popup closes. */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--offwhite)] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                    <CalendarDays size={15} />
                    Pickup date
                  </div>
                  <p className="mt-2 font-bold text-[var(--navy)]">
                    {formatDate(startDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--offwhite)] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                    <CalendarDays size={15} />
                    Return date
                  </div>
                  <p className="mt-2 font-bold text-[var(--navy)]">
                    {formatDate(endDate)}
                  </p>
                </div>
              </div>

              {startDate && !endDate && (
                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                  Select a return date after {formatDate(startDate)}.
                </p>
              )}

              <div className="mt-7 rounded-2xl bg-[var(--green-soft)] p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-[var(--green)]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">
                      Protected rental
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                      The security deposit protects against legitimate
                      damage or loss claims. It is not automatically
                      kept by the owner.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-[var(--red)]/20 bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-5 text-[var(--red)]"
                >
                  {error}
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="bl-card p-6">
              <h2 className="text-2xl">Rental summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">Daily rate</span>
                  <span className="font-bold text-[var(--navy)]">
                    LKR {Number(book.dailyRate).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">Duration</span>
                  <span className="font-bold text-[var(--navy)]">
                    {duration > 0 ? `${duration} days` : 'Not selected'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Rental amount
                  </span>
                  <span className="font-bold text-[var(--navy)]">
                    LKR {rentalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Security deposit
                  </span>
                  <span className="font-bold text-[var(--navy)]">
                    LKR {securityDeposit.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-[var(--border)] pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-[var(--navy)]">
                      Estimated total
                    </span>
                    <span className="font-serif text-xl font-medium text-[var(--navy)] sm:text-2xl">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequest}
                disabled={
                  submitting ||
                  availabilityLoading ||
                  Boolean(availabilityError) ||
                  !startDate ||
                  !endDate
                }
                className="bl-button bl-button-primary mt-7 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending request...' : 'Request to rent'}
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-[var(--ink-soft)]">
                This sends a rental request to the owner. Payment is
                handled after the request is approved.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--offwhite)]/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[var(--ink-soft)]">
              {duration > 0
                ? `${duration}-day rental`
                : 'Choose rental dates'}
            </p>
            <p className="font-bold text-[var(--navy)]">
              LKR {totalAmount.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequest}
            disabled={
              submitting ||
              availabilityLoading ||
              Boolean(availabilityError) ||
              !startDate ||
              !endDate
            }
            className="bl-button bl-button-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Request'}
          </button>
        </div>
      </div>
    </main>
  );
}
