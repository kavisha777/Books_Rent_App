'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
  Upload,
} from 'lucide-react';

import { apiRequest } from '../../../../../lib/api';
import { getAccessToken } from '../../../../../lib/auth';

type ConditionStatus = 'GOOD' | 'DAMAGED' | 'LOST';

type RentalBook = {
  id: string;
  title?: string;
  author?: string;
  coverImage?: string | null;
  imageUrl?: string | null;
  pickupLocation?: string | null;
};

type RentalOwner = {
  name?: string;
  fullName?: string;
};

type Rental = {
  id: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  returnedAt?: string | null;
  book?: RentalBook | null;
  owner?: RentalOwner | null;
};

type RentalResponse = {
  success?: boolean;
  message?: string;
  data?: {
    rental?: Rental;
  };
  rental?: Rental;
};

type ConditionResponse = {
  success?: boolean;
  message?: string;
  data?: {
    conditionRecord?: unknown;
  };
};

function extractRental(response: RentalResponse): Rental | null {
  return response.rental || response.data?.rental || null;
}

function getCover(book?: RentalBook | null) {
  return book?.coverImage || book?.imageUrl || '';
}

function formatDate(value?: string | null) {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReturnBookClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const rentalId = params?.id;

  const [rental, setRental] = useState<Rental | null>(null);
  const [condition, setCondition] =
    useState<ConditionStatus>('GOOD');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const book = rental?.book;

  const canReturn = rental?.status === 'ACTIVE';

  const conditionMessage = useMemo(() => {
    if (condition === 'GOOD') {
      return 'The book is in good condition with no new damage.';
    }

    if (condition === 'DAMAGED') {
      return 'Please describe any damage clearly. The owner can inspect the book after return.';
    }

    return 'Mark the book as lost only if you cannot return the physical copy.';
  }, [condition]);

  useEffect(() => {
    async function loadRental() {
      if (!rentalId) return;

      const token = getAccessToken();

      if (!token) {
        router.push('/login');
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

        const loadedRental = extractRental(response);

        if (!loadedRental) {
          throw new Error('Rental information was not found.');
        }

        setRental(loadedRental);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load this rental.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadRental();
  }, [rentalId, router]);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const remainingSlots = Math.max(0, 5 - photos.length);

    const selectedFiles = files.slice(0, remainingSlots);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setPhotos((current) => [...current, ...previewUrls]);

    event.target.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((current) =>
      current.filter((_, photoIndex) => photoIndex !== index),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!rentalId) {
      setError('Invalid rental ID.');
      return;
    }

    if (!rental) {
      setError('Rental information is unavailable.');
      return;
    }

    if (!canReturn) {
      setError(
        'Only an active rental can be returned at this stage.',
      );
      return;
    }

    const token = getAccessToken();

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      /*
       * The backend currently has no image-upload endpoint.
       * Therefore local preview URLs are NOT sent as imageUrls.
       *
       * When Cloudinary/S3 upload is added later, replace this
       * with the uploaded HTTPS URLs.
       */
      const conditionResponse =
        await apiRequest<ConditionResponse>(
          `/rentals/${rentalId}/conditions`,
          {
            method: 'POST',
            auth: true,
            body: JSON.stringify({
              status: condition,
              notes: notes.trim(),
              imageUrls: [],
            }),
          },
        );

      if (conditionResponse.success === false) {
        throw new Error(
          conditionResponse.message ||
            'Unable to save the book condition.',
        );
      }

      await apiRequest(
        `/rentals/${rentalId}/return`,
        {
          method: 'PATCH',
          auth: true,
        },
      );

      setSuccess(true);

      setTimeout(() => {
        router.push('/rentals');
        router.refresh();
      }, 900);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to submit the return.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] py-8">
        <div className="bl-container">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-[var(--cream)]" />
            <div className="h-10 w-72 rounded bg-[var(--cream)]" />

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="h-[560px] rounded-[24px] bg-white" />
              <div className="h-[360px] rounded-[24px] bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !rental) {
    return (
      <main className="min-h-[calc(100vh-72px)] py-12">
        <div className="bl-container">
          <div className="mx-auto max-w-xl rounded-[24px] border border-[var(--border)] bg-white p-8 text-center">
            <CircleAlert className="mx-auto mb-4 h-10 w-10 text-[var(--red)]" />

            <h1 className="text-3xl">
              Unable to load rental
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
              {error}
            </p>

            <Link
              href="/rentals"
              className="bl-button bl-button-primary mt-6"
            >
              Back to My Rentals
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green-soft)]">
            <CheckCircle2 className="h-10 w-10 text-[var(--green)]" />
          </div>

          <h1 className="mt-6 text-4xl">
            Return requested
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
            Your condition report has been recorded and the owner
            has been notified that the book is ready for return
            inspection.
          </p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            Redirecting to My Rentals…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] pb-28 pt-6 md:pb-12 md:pt-10">
      <div className="bl-container">
        <Link
          href="/rentals"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Rentals
        </Link>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Return book
          </p>

          <h1 className="mt-2 text-4xl md:text-5xl">
            Complete your return
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            Tell us about the book's current condition before
            submitting the return request.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--red)]/20 bg-[var(--red-soft)] p-4 text-sm text-[var(--red)]">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <section className="bl-card p-5 md:p-7">
              <div className="flex gap-4">
                <div
                  className="book-cover h-28 w-20 shrink-0"
                  style={
                    getCover(book)
                      ? {
                          backgroundImage: `url(${getCover(book)})`,
                        }
                      : undefined
                  }
                >
                  {!getCover(book) && (
                    <BookOpen className="m-auto h-7 w-7 opacity-70" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-2xl">
                    {book?.title || 'Book'}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {book?.author || 'Unknown author'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {book?.pickupLocation || 'Pickup location'}
                    </span>

                    <span>
                      {formatDate(rental?.startDate)} –{' '}
                      {formatDate(rental?.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bl-card p-5 md:p-7">
              <div>
                <h2 className="text-2xl">
                  Book condition
                </h2>

                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Select the condition that best describes the book
                  right now.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'GOOD' as const,
                    label: 'Good',
                    description: 'No new damage',
                  },
                  {
                    value: 'DAMAGED' as const,
                    label: 'Damaged',
                    description: 'Damage is present',
                  },
                  {
                    value: 'LOST' as const,
                    label: 'Lost',
                    description: 'Book cannot be returned',
                  },
                ].map((option) => {
                  const selected = condition === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCondition(option.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                          : 'border-[var(--border)] bg-white hover:border-[var(--navy)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">
                          {option.label}
                        </span>

                        {selected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="h-5 w-5 rounded-full border border-current opacity-30" />
                        )}
                      </div>

                      <p
                        className={`mt-2 text-xs ${
                          selected
                            ? 'text-white/70'
                            : 'text-[var(--ink-soft)]'
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--cream)] p-4 text-sm leading-6 text-[var(--ink-soft)]">
                {conditionMessage}
              </div>
            </section>

            <section className="bl-card p-5 md:p-7">
              <div>
                <h2 className="text-2xl">
                  Condition notes
                </h2>

                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Add any useful details for the owner.
                </p>
              </div>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                maxLength={2000}
                rows={6}
                placeholder="For example: small crease on the back cover..."
                className="mt-5 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-4 text-sm outline-none transition focus:border-[var(--navy)]"
              />

              <div className="mt-2 text-right text-xs text-[var(--ink-muted)]">
                {notes.length}/2000
              </div>
            </section>

            <section className="bl-card p-5 md:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)]">
                  <ImagePlus className="h-5 w-5 text-[var(--gold)]" />
                </div>

                <div>
                  <h2 className="text-2xl">
                    Evidence photos
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    Photos can help document damage or the book's
                    condition. Image upload to cloud storage will be
                    connected in the media-storage phase.
                  </p>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--offwhite)] px-5 py-8 text-sm font-bold text-[var(--navy)] transition hover:border-[var(--navy)]">
                <Upload className="h-5 w-5" />
                Add photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Condition evidence ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bl-card p-5 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold-soft)]">
                  <Star className="h-5 w-5 text-[var(--gold)]" />
                </div>

                <div>
                  <h2 className="text-2xl">
                    Lending experience
                  </h2>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    Reviews are available after the rental is
                    completed.
                  </p>
                </div>
              </div>
            </section>
          </form>

          <aside className="hidden lg:block">
            <div className="bl-card sticky top-24 p-6">
              <h2 className="text-2xl">
                Return summary
              </h2>

              <div className="mt-6 space-y-4 border-b border-[var(--border)] pb-6">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Return date
                  </span>

                  <span className="font-semibold">
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[var(--ink-soft)]">
                    Condition
                  </span>

                  <span className="font-semibold">
                    {condition}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[var(--green-soft)] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--green)]" />

                  <p className="text-xs leading-5 text-[var(--green)]">
                    Your condition report is recorded before the
                    owner performs the return inspection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting || !canReturn}
                onClick={() => {
                  const form = document.querySelector(
                    'form',
                  ) as HTMLFormElement | null;

                  form?.requestSubmit();
                }}
                className="bl-button bl-button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit return
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          disabled={submitting || !canReturn}
          onClick={() => {
            const form = document.querySelector(
              'form',
            ) as HTMLFormElement | null;

            form?.requestSubmit();
          }}
          className="bl-button bl-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Submit return
            </>
          )}
        </button>
      </div>
    </main>
  );
}