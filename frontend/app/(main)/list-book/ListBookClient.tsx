'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';

import { apiRequest } from '../../../lib/api';
import { getAccessToken } from '../../../lib/auth';

type BookResponse = {
  success?: boolean;
  message?: string;
  data?: {
    book?: {
      id?: string;
    };
    id?: string;
  };
  book?: {
    id?: string;
  };
  id?: string;
};

function extractBookId(response: BookResponse): string | null {
  return (
    response.book?.id ||
    response.data?.book?.id ||
    response.data?.id ||
    response.id ||
    null
  );
}

export default function ListBookClient() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [pickupArea, setPickupArea] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [description, setDescription] = useState('');

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Cover image must be smaller than 5 MB.');
      return;
    }

    setError('');
    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  }

  function removeCover() {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(null);
    setCoverFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!getAccessToken()) {
      setError('Please sign in before listing a book.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter the book title.');
      return;
    }

    if (!author.trim()) {
      setError('Please enter the author name.');
      return;
    }

    if (!category) {
      setError('Please select a category.');
      return;
    }

    const rate = Number(dailyRate);
    const deposit = Number(securityDeposit);

    if (!Number.isFinite(rate) || rate <= 0) {
      setError('Please enter a valid daily rental rate.');
      return;
    }

    if (!Number.isFinite(deposit) || deposit < 0) {
      setError('Please enter a valid security deposit.');
      return;
    }

    if (!pickupArea.trim()) {
      setError('Please enter a pickup area.');
      return;
    }

    if (!description.trim()) {
      setError('Please add a short description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest<BookResponse>('/books', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          isbn: isbn.trim() || undefined,
          category,
          dailyRate: rate,
          securityDeposit: deposit,
          condition,
          description: description.trim(),
          pickupLocation: pickupArea.trim(),
        }),
      });

      const bookId = extractBookId(response);

      setSuccess(true);

      /*
       * The current backend does not yet upload the selected cover image.
       * We keep the image picker in the UI so the frontend is ready for
       * Cloudinary/S3 integration later.
       */
      void coverFile;

      setTimeout(() => {
        if (bookId) {
          router.push(`/book/${bookId}`);
        } else {
          router.push('/explore');
        }

        router.refresh();
      }, 900);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to publish your book. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-[calc(100vh-72px)] px-4 py-12">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="bl-card w-full p-8 text-center sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-soft)]">
              <CheckCircle2
                size={34}
                className="text-[var(--green)]"
              />
            </div>

            <h1 className="text-3xl">Book published</h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
              Your book has been added to BookLoop and is now available
              for readers to discover.
            </p>

            <div className="mt-6 rounded-2xl bg-[var(--cream)] px-4 py-3 text-sm font-semibold text-[var(--navy)]">
              Opening your book...
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] pb-12">
      <div className="bl-container pt-6 sm:pt-10">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
        >
          <ArrowLeft size={17} />
          Back to Explore
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Share a book
          </p>

          <h1 className="text-4xl sm:text-5xl">
            Give your shelf a second life.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
            List a book you own, set your rental terms, and let other
            readers borrow it safely.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="bl-card p-5 sm:p-7">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cream)]">
                  <BookOpen
                    size={20}
                    className="text-[var(--navy)]"
                  />
                </div>

                <div>
                  <h2 className="text-xl">Book information</h2>
                  <p className="text-xs text-[var(--ink-soft)]">
                    Tell readers about the book you are lending.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Book title *
                  </span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. The Psychology of Money"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none transition focus:border-[var(--navy)]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Author *
                  </span>
                  <input
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    placeholder="e.g. Morgan Housel"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none transition focus:border-[var(--navy)]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    ISBN
                  </span>
                  <input
                    value={isbn}
                    onChange={(event) => setIsbn(event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none transition focus:border-[var(--navy)]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Category *
                  </span>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                  >
                    <option value="">Select category</option>
                    <option value="Personal Finance">
                      Personal Finance
                    </option>
                    <option value="Self Development">
                      Self Development
                    </option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Education">Education</option>
                    <option value="Biography">Biography</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Condition *
                  </span>

                  <select
                    value={condition}
                    onChange={(event) => setCondition(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                  >
                    <option value="GOOD">Good</option>
                    <option value="DAMAGED">Damaged</option>
                    <option value="UNVERIFIED">Unverified</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Daily rental rate (LKR) *
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={dailyRate}
                    onChange={(event) => setDailyRate(event.target.value)}
                    placeholder="e.g. 100"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Security deposit (LKR) *
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={securityDeposit}
                    onChange={(event) =>
                      setSecurityDeposit(event.target.value)
                    }
                    placeholder="e.g. 1500"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Pickup area *
                  </span>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                    />

                    <input
                      value={pickupArea}
                      onChange={(event) =>
                        setPickupArea(event.target.value)
                      }
                      placeholder="e.g. Moratuwa, Colombo"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--offwhite)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--navy)]"
                    />
                  </div>
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-[var(--navy)]">
                    Description *
                  </span>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={5}
                    placeholder="Describe the book, its condition, and anything a borrower should know..."
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--offwhite)] px-4 py-3 text-sm leading-6 outline-none focus:border-[var(--navy)]"
                  />
                </label>
              </div>

              <div className="mt-7 border-t border-[var(--border)] pt-7">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl">Book cover</h2>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      JPG, PNG or WEBP · Maximum 5 MB
                    </p>
                  </div>
                </div>

                {coverPreview ? (
                  <div className="relative h-56 w-40 overflow-hidden rounded-xl border border-[var(--border)]">
                    <img
                      src={coverPreview}
                      alt="Book cover preview"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--navy)] shadow"
                      aria-label="Remove cover"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--offwhite)] px-5 text-center transition hover:border-[var(--navy)]">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <ImagePlus
                        size={22}
                        className="text-[var(--navy)]"
                      />
                    </div>

                    <span className="text-sm font-bold text-[var(--navy)]">
                      Add a cover image
                    </span>

                    <span className="mt-1 text-xs text-[var(--ink-soft)]">
                      Tap to choose an image
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-[var(--red)]/20 bg-[var(--red-soft)] px-4 py-3 text-sm font-semibold leading-5 text-[var(--red)]">
                  {error}
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  href="/explore"
                  className="bl-button bl-button-secondary"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bl-button bl-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={17} />
                  {isSubmitting ? 'Publishing...' : 'Publish book'}
                </button>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="bl-card p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--green-soft)]">
                  <ShieldCheck
                    size={22}
                    className="text-[var(--green)]"
                  />
                </div>

                <h2 className="text-xl">BookLoop protection</h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">
                      Security deposit
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                      The deposit helps protect against legitimate
                      damage or loss claims.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">
                      Condition tracking
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                      The book condition can be checked during the
                      return process.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[var(--navy)]">
                      Secure rentals
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                      Rental requests must go through the BookLoop
                      rental workflow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden rounded-2xl bg-[var(--navy)] p-6 text-white lg:block">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--cream)]">
                  A better bookshelf
                </p>

                <p className="mt-3 font-serif text-2xl leading-tight">
                  Your books can help someone discover their next
                  favourite read.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}