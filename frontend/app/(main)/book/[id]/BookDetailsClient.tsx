'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Globe2,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../../../lib/api';

type Book = {
  id: string;
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  language?: string;
  publishedYear?: number;
  publishedAt?: string;
  condition?: string;
  status?: string;
  dailyRate?: number;
  securityDeposit?: number;
  description?: string;
  coverImage?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  owner?: {
    id?: string;
    name?: string;
    email?: string;
  };
  user?: {
    id?: string;
    name?: string;
  };
}

type BookResponse = {
  success?: boolean;
  message?: string;
  data?: Book | { book?: Book };
  book?: Book;
};

type BookDetailsClientProps = {
  bookId: string;
};

function extractBook(response: BookResponse): Book | null {
  if (response.book) {
    return response.book;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    'book' in response.data &&
    response.data.book
  ) {
    return response.data.book;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    'id' in response.data
  ) {
    return response.data;
  }

  return null;
}

function formatPrice(value?: number) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function formatCondition(condition?: string) {
  if (!condition) {
    return 'Good';
  }

  return condition
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) {
    return 'Not specified';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

export default function BookDetailsClient({
  bookId,
}: BookDetailsClientProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadBook() {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<BookResponse>(
          `/books/${bookId}`,
        );

        if (!mounted) {
          return;
        }

        const loadedBook = extractBook(response);

        if (!loadedBook) {
          throw new Error('Book details were not found.');
        }

        setBook(loadedBook);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load this book.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (bookId) {
      loadBook();
    }

    return () => {
      mounted = false;
    };
  }, [bookId]);

  const rentalAmount = useMemo(() => {
    return Number(book?.dailyRate || 0) * duration;
  }, [book?.dailyRate, duration]);

  const securityDeposit = Number(book?.securityDeposit || 0);

  const estimatedTotal = rentalAmount + securityDeposit;

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)]">
        <div className="bl-container py-8">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-[var(--cream)]" />

          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="h-[520px] animate-pulse rounded-3xl bg-[var(--cream)]" />

            <div className="space-y-5">
              <div className="h-5 w-32 animate-pulse rounded bg-[var(--cream)]" />
              <div className="h-14 w-3/4 animate-pulse rounded bg-[var(--cream)]" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-[var(--cream)]" />
              <div className="h-32 animate-pulse rounded-2xl bg-[var(--cream)]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)]">
        <div className="bl-container flex min-h-[70vh] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream)]">
              <BookOpen size={28} className="text-[var(--navy)]" />
            </div>

            <h1 className="text-3xl">Book not found</h1>

            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
              {error ||
                'This book may have been removed or is no longer available.'}
            </p>

            <Link
              href="/explore"
              className="mt-6 inline-flex rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isAvailable =
    !book.status ||
    book.status.toUpperCase() === 'AVAILABLE';

  const coverImage = book.coverImage || book.imageUrl;

  const ownerName =
    book.owner?.name ||
    book.user?.name ||
    'BookLoop member';

  const rating = Number(book.rating || 0);

  return (
    <main className="min-h-screen bg-[var(--offwhite)] pb-28 md:pb-10">
      <div className="bl-container py-5 md:py-8">
        {/* Back */}
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--navy)]"
        >
          <ArrowLeft size={17} />
          Back to Explore
        </Link>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Book cover */}
          <section>
            <div
              className={`book-cover ${
                coverImage ? '' : 'cover-one'
              } h-[500px] rounded-3xl shadow-sm sm:h-[560px]`}
              style={
                coverImage
                  ? {
                      backgroundImage: `url(${coverImage})`,
                    }
                  : undefined
              }
            >
              {!coverImage && (
                <div className="book-cover-content p-7">
                  <BookOpen
                    size={40}
                    className="mb-5 text-white/80"
                  />

                  <p className="font-serif text-4xl leading-tight text-white">
                    {book.title}
                  </p>

                  <p className="mt-2 text-sm text-white/70">
                    {book.author}
                  </p>
                </div>
              )}

              {isAvailable && (
                <div className="book-cover-content absolute left-5 top-5 z-10">
                  <span className="rounded-full bg-[var(--green)] px-3 py-1.5 text-xs font-bold text-white">
                    Available to rent
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Details */}
          <section>
            <div className="mb-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {book.category && (
                  <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold text-[var(--navy)]">
                    {book.category}
                  </span>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isAvailable
                      ? 'bg-[var(--green-soft)] text-[var(--green)]'
                      : 'bg-[var(--red-soft)] text-[var(--red)]'
                  }`}
                >
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <h1 className="text-4xl leading-tight md:text-5xl">
                {book.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                <UserRound size={16} />
                by {book.author}
              </p>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star
                    size={17}
                    className="fill-[var(--gold)] text-[var(--gold)]"
                  />

                  <span className="text-sm font-bold">
                    {rating.toFixed(1)}
                  </span>
                </div>

                <span className="text-sm text-[var(--ink-muted)]">
                  {book.reviewCount || 0} reviews
                </span>
              </div>
            )}

            {/* About */}
            <div className="mb-7">
              <h2 className="mb-3 text-2xl">About this book</h2>

              <p className="text-sm leading-7 text-[var(--ink-soft)]">
                {book.description ||
                  'No description has been added for this book yet.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <BookOpen
                  size={18}
                  className="mb-3 text-[var(--gold)]"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Condition
                </p>

                <p className="mt-1 text-sm font-bold">
                  {formatCondition(book.condition)}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <Globe2
                  size={18}
                  className="mb-3 text-[var(--gold)]"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Language
                </p>

                <p className="mt-1 text-sm font-bold">
                  {book.language || 'Not specified'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <CalendarDays
                  size={18}
                  className="mb-3 text-[var(--gold)]"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Published
                </p>

                <p className="mt-1 text-sm font-bold">
                  {book.publishedYear ||
                    formatDate(book.publishedAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <ShieldCheck
                  size={18}
                  className="mb-3 text-[var(--gold)]"
                />

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  ISBN
                </p>

                <p className="mt-1 truncate text-sm font-bold">
                  {book.isbn || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Owner */}
            <div className="mb-7 rounded-2xl border border-[var(--border)] bg-white p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                Listed by
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cream)]">
                  <CircleUserRound
                    size={23}
                    className="text-[var(--navy)]"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--navy)]">
                    {ownerName}
                  </p>

                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    BookLoop community member
                  </p>
                </div>

                <CheckCircle2
                  size={18}
                  className="ml-auto text-[var(--green)]"
                />
              </div>
            </div>

            {/* Desktop rental card */}
            <div className="hidden rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:block">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Rental price
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[var(--navy)]">
                    {formatPrice(book.dailyRate)}
                    <span className="text-sm font-medium text-[var(--ink-muted)]">
                      /day
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--ink-muted)]">
                    Security deposit
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatPrice(securityDeposit)}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Rental duration
                </p>

                <div className="relative">
                  <select
                    value={duration}
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold outline-none"
                  >
                    <option value={3}>3 days</option>
                    <option value={5}>5 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={21}>21 days</option>
                    <option value={30}>30 days</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div className="mb-5 space-y-3 border-y border-[var(--border)] py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-soft)]">
                    Rental ({duration} days)
                  </span>

                  <span className="font-semibold">
                    {formatPrice(rentalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--ink-soft)]">
                    Security deposit
                  </span>

                  <span className="font-semibold">
                    {formatPrice(securityDeposit)}
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="font-bold text-[var(--navy)]">
                    Estimated total
                  </span>

                  <span className="font-bold text-[var(--navy)]">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              <Link
                href={
                  isAvailable
                    ? `/rentals/request/${book.id}`
                    : '#'
                }
                className={`flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold ${
                  isAvailable
                    ? 'bg-[var(--navy)] text-white hover:bg-[var(--navy-2)]'
                    : 'cursor-not-allowed bg-[var(--cream)] text-[var(--ink-muted)]'
                }`}
              >
                {isAvailable ? 'Request to rent' : 'Currently unavailable'}
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--ink-muted)]">
                <ShieldCheck size={15} />
                Security deposit protected by BookLoop rules
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile bottom action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-white/95 p-4 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-[var(--ink-muted)]">
              From
            </p>

            <p className="text-lg font-bold text-[var(--navy)]">
              {formatPrice(book.dailyRate)}
              <span className="text-xs font-medium text-[var(--ink-muted)]">
                /day
              </span>
            </p>
          </div>

          <Link
            href={
              isAvailable ? `/rentals/request/${book.id}` : '#'
            }
            className={`rounded-xl px-5 py-3.5 text-sm font-bold ${
              isAvailable
                ? 'bg-[var(--navy)] text-white'
                : 'pointer-events-none bg-[var(--cream)] text-[var(--ink-muted)]'
            }`}
          >
            {isAvailable ? 'Request to rent' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </main>
  );
}