'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Star,
  User,
} from 'lucide-react';

import { apiRequest } from '../../../../lib/api';
import { getAccessToken } from '../../../../lib/auth';

type Person = {
  id: string;
  name: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  condition?: string | null;
  dailyRate?: number | string | null;
  securityDeposit?: number | string | null;
};

type ConditionRecord = {
  id: string;
  status: string;
  notes?: string | null;
  imageUrls?: string[];
  createdAt: string;
};

type Rental = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  rentalAmount?: number | string | null;
  securityDeposit?: number | string | null;
  book: Book;
  renter: Person;
  owner: Person;
  conditionRecords?: ConditionRecord[];
};

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: Person;
  reviewee?: Person;
};

type RentalResponse = {
  success?: boolean;
  data?: {
    rental?: Rental;
  };
};

type ReviewsResponse = {
  success?: boolean;
  data?: {
    reviews?: Review[];
    count?: number;
  };
};

function money(value: unknown) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return 'Rs. 0';
  }

  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

function formatDate(value?: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function statusLabel(status: string) {
  return status
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function RentalDetailsClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const rentalId = params.id;

  const [rental, setRental] = useState<Rental | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const loadRental = async () => {
      if (!getAccessToken()) {
        router.replace('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<RentalResponse>(
          `/rentals/${rentalId}`,
          {
            method: 'GET',
            auth: true,
          },
        );

        const nextRental = response.data?.rental;

        if (!nextRental) {
          throw new Error('Rental information was not returned.');
        }

        setRental(nextRental);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load this rental.',
        );
      } finally {
        setLoading(false);
      }
    };

    void loadRental();
  }, [rentalId, router]);

  useEffect(() => {
    if (!rentalId) return;

    const loadReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await apiRequest<ReviewsResponse>(
          `/rentals/${rentalId}/reviews`,
          {
            method: 'GET',
            auth: true,
          },
        );

        setReviews(response.data?.reviews ?? []);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    void loadReviews();
  }, [rentalId]);

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) {
      setReviewMessage('Please select a rating.');
      return;
    }

    if (rental?.status !== 'COMPLETED') {
      setReviewMessage(
        'A review can only be submitted after the rental is completed.',
      );
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMessage('');

      const response = await apiRequest<{
        success?: boolean;
        data?: {
          review?: Review;
        };
      }>(`/rentals/${rentalId}/reviews`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const createdReview = response.data?.review;

      if (createdReview) {
        setReviews((current) => [...current, createdReview]);
      } else {
        const refreshed = await apiRequest<ReviewsResponse>(
          `/rentals/${rentalId}/reviews`,
          {
            method: 'GET',
            auth: true,
          },
        );

        setReviews(refreshed.data?.reviews ?? []);
      }

      setRating(0);
      setComment('');
      setReviewMessage('Review submitted successfully.');
    } catch (err) {
      setReviewMessage(
        err instanceof Error
          ? err.message
          : 'Unable to submit your review.',
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)]">
        <div className="bl-container py-8">
          <div className="h-6 w-24 animate-pulse rounded bg-[var(--cream)]" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-[var(--cream)]" />
          <div className="mt-6 h-48 animate-pulse rounded-3xl bg-[var(--cream)]" />
        </div>
      </main>
    );
  }

  if (error || !rental) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)]">
        <div className="bl-container flex min-h-[70vh] items-center justify-center">
          <div className="bl-card max-w-lg p-8 text-center">
            <BookOpen
              size={28}
              className="mx-auto text-[var(--red)]"
            />
            <h1 className="mt-4 text-2xl">Rental unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              {error || 'This rental could not be found.'}
            </p>

            <button
              type="button"
              onClick={() => router.push('/rentals')}
              className="bl-button bl-button-primary mt-6"
            >
              Back to rentals
            </button>
          </div>
        </div>
      </main>
    );
  }

  const total =
    Number(rental.rentalAmount ?? 0) +
    Number(rental.securityDeposit ?? 0);

  return (
    <main className="min-h-screen bg-[var(--offwhite)] pb-24 md:pb-12">
      <div className="bl-container py-6 md:py-10">
        <button
          type="button"
          onClick={() => router.push('/rentals')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--navy)]"
        >
          <ArrowLeft size={18} />
          My rentals
        </button>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <section className="bl-card overflow-hidden">
              <div className="bg-[var(--navy)] p-6 text-white md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                      Rental details
                    </p>

                    <h1 className="mt-2 text-3xl text-white md:text-4xl">
                      {rental.book.title}
                    </h1>

                    <p className="mt-2 text-sm text-white/70">
                      by {rental.book.author}
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                    {statusLabel(rental.status)}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-2 md:p-7">
                <div className="rounded-2xl bg-[var(--offwhite)] p-5">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={19}
                      className="text-[var(--gold)]"
                    />
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                      Rental period
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {formatDate(rental.startDate)}
                  </p>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    to {formatDate(rental.endDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--offwhite)] p-5">
                  <div className="flex items-center gap-3">
                    <Clock3
                      size={19}
                      className="text-[var(--gold)]"
                    />
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                      Rental status
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {statusLabel(rental.status)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-3">
                    <User
                      size={19}
                      className="text-[var(--navy)]"
                    />
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                      Borrower
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {rental.renter.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-3">
                    <User
                      size={19}
                      className="text-[var(--navy)]"
                    />
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                      Book owner
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    {rental.owner.name}
                  </p>
                </div>
              </div>
            </section>

            <section className="bl-card p-5 md:p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[var(--green)]"
                />
                <h2 className="text-xl">Condition history</h2>
              </div>

              <div className="mt-5 space-y-3">
                {(rental.conditionRecords ?? []).length === 0 ? (
                  <p className="rounded-2xl bg-[var(--offwhite)] p-5 text-sm text-[var(--ink-soft)]">
                    No condition records have been added yet.
                  </p>
                ) : (
                  rental.conditionRecords?.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-2xl border border-[var(--border)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold">
                          {statusLabel(record.status)}
                        </span>

                        <span className="text-xs text-[var(--ink-muted)]">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>

                      {record.notes && (
                        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="bl-card p-5 md:p-7">
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={20}
                  className="text-[var(--gold)]"
                />
                <h2 className="text-xl">Reviews</h2>
              </div>

              {reviewsLoading ? (
                <div className="mt-5 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Loading reviews…
                </div>
              ) : reviews.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-[var(--offwhite)] p-5 text-sm text-[var(--ink-soft)]">
                  No reviews have been submitted for this rental yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-[var(--border)] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold">
                            {review.reviewer?.name ||
                              'BookLoop member'}
                          </p>

                          <p className="mt-1 text-xs text-[var(--ink-muted)]">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-[var(--gold)]">
                          {Array.from(
                            { length: 5 },
                            (_, index) => (
                              <Star
                                key={index}
                                size={15}
                                fill={
                                  index < review.rating
                                    ? 'currentColor'
                                    : 'none'
                                }
                              />
                            ),
                          )}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
                          {review.comment}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {rental.status === 'COMPLETED' && (
                <form
                  onSubmit={submitReview}
                  className="mt-7 border-t border-[var(--border)] pt-7"
                >
                  <h3 className="text-lg">
                    Share your experience
                  </h3>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    Leave a review for the other person involved
                    in this completed rental.
                  </p>

                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                      Rating
                    </p>

                    <div className="mt-3 flex gap-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        const value = index + 1;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            aria-label={`${value} star${
                              value === 1 ? '' : 's'
                            }`}
                            className="rounded-lg p-1 text-[var(--gold)] transition hover:scale-105"
                          >
                            <Star
                              size={27}
                              fill={
                                value <= rating
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    maxLength={1000}
                    rows={4}
                    placeholder="Write a short review…"
                    className="mt-5 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--navy)]"
                  />

                  {reviewMessage && (
                    <p className="mt-3 text-sm font-semibold text-[var(--ink-soft)]">
                      {reviewMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bl-button bl-button-primary mt-4 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Submit review
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-6">
            <section className="bl-card p-5 md:p-6">
              <h2 className="text-xl">Payment summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--ink-soft)]">
                    Rental amount
                  </span>
                  <span className="font-semibold">
                    {money(rental.rentalAmount)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[var(--ink-soft)]">
                    Security deposit
                  </span>
                  <span className="font-semibold">
                    {money(rental.securityDeposit)}
                  </span>
                </div>

                <div className="border-t border-[var(--border)] pt-3">
                  <div className="flex justify-between gap-4">
                    <span className="font-bold">
                      Total
                    </span>
                    <span className="font-bold text-[var(--navy)]">
                      {money(total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-5">
              <div className="flex gap-3">
                <BookOpen
                  size={19}
                  className="mt-0.5 shrink-0 text-[var(--navy)]"
                />

                <div>
                  <p className="text-sm font-bold">
                    {rental.book.title}
                  </p>

                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    {rental.book.author}
                  </p>

                  {rental.book.condition && (
                    <p className="mt-3 text-xs font-semibold">
                      Condition: {statusLabel(rental.book.condition)}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}