'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
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
  data?: {
    book?: Book;
  };
  book?: Book;
};

type RentalResponse = {
  success?: boolean;
  message?: string;
  data?: {
    rental?: {
      id?: string;
    };
    id?: string;
  };
  rental?: {
    id?: string;
  };
  id?: string;
};

function extractBook(response: BookResponse): Book | null {
  return response.book || response.data?.book || null;
}

function extractRentalId(response: RentalResponse): string | null {
  return (
    response.rental?.id ||
    response.data?.rental?.id ||
    response.data?.id ||
    response.id ||
    null
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function toApiDate(date: Date) {
  return date.toISOString();
}

export default function RentalRequestClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const bookId = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [duration, setDuration] = useState(7);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const startDate = useMemo(() => {
    return new Date();
  }, []);

  const endDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + duration);
    return date;
  }, [duration]);

  const rentalAmount = useMemo(() => {
    return book ? Number(book.dailyRate) * duration : 0;
  }, [book, duration]);

  const securityDeposit = useMemo(() => {
    return book ? Number(book.securityDeposit) : 0;
  }, [book]);

  const totalAmount = rentalAmount + securityDeposit;

  useEffect(() => {
    let mounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<BookResponse>(
          `/books/${bookId}`,
        );

        const loadedBook = extractBook(response);

        if (!mounted) {
          return;
        }

        if (!loadedBook) {
          setError('Book information could not be found.');
          return;
        }

        setBook(loadedBook);
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load this book.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (bookId) {
      void loadBook();
    }

    return () => {
      mounted = false;
    };
  }, [bookId]);

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

    setSubmitting(true);

    try {
      const response = await apiRequest<RentalResponse>('/rentals', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          bookId: book.id,
          startDate: toApiDate(startDate),
          endDate: toApiDate(endDate),
          rentalAmount,
          securityDeposit,
        }),
      });

      const rentalId = extractRentalId(response);

      setSuccess(true);

      setTimeout(() => {
        if (rentalId) {
          router.push('/rentals');
        } else {
          router.push('/rentals');
        }

        router.refresh();
      }, 900);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
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
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="bl-card h-[520px] bg-white" />
              <div className="bl-card h-[420px] bg-white" />
            </div>
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

            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
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

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
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
            Choose your rental period and send a request to the book
            owner.
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

              <div>
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
              <div className="mb-4 flex items-center gap-2">
                <Clock3 size={18} className="text-[var(--navy)]" />
                <h2 className="text-xl">Rental duration</h2>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[3, 5, 7, 14, 21, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDuration(days)}
                    className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${
                      duration === days
                        ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                        : 'border-[var(--border)] bg-[var(--offwhite)] text-[var(--navy)] hover:border-[var(--navy)]'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--offwhite)] p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                  <CalendarDays size={15} />
                  Pickup
                </div>

                <p className="mt-2 font-bold text-[var(--navy)]">
                  {formatDate(startDate)}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--offwhite)] p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                  <CalendarDays size={15} />
                  Return
                </div>

                <p className="mt-2 font-bold text-[var(--navy)]">
                  {formatDate(endDate)}
                </p>
              </div>
            </div>

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
                    Your security deposit is held as protection for
                    legitimate damage or loss claims. It is not
                    automatically kept by the owner.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-[var(--red)]/20 bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-5 text-[var(--red)]">
                {error}
              </div>
            )}
          </section>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="bl-card p-6">
              <h2 className="text-2xl">Rental summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Daily rate
                  </span>
                  <span className="font-bold text-[var(--navy)]">
                    LKR {Number(book.dailyRate).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Duration
                  </span>
                  <span className="font-bold text-[var(--navy)]">
                    {duration} days
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
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--navy)]">
                      Estimated total
                    </span>
                    <span className="font-serif text-2xl font-medium text-[var(--navy)]">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequest}
                disabled={submitting}
                className="bl-button bl-button-primary mt-7 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Sending request...'
                  : 'Request to rent'}
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
              {duration}-day rental
            </p>
            <p className="font-bold text-[var(--navy)]">
              LKR {totalAmount.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequest}
            disabled={submitting}
            className="bl-button bl-button-primary shrink-0 disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Request'}
          </button>
        </div>
      </div>
    </main>
  );
}