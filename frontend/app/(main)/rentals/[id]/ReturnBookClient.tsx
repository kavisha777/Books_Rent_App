'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Star,
  Upload,
  X,
} from 'lucide-react';

type Condition = 'GOOD' | 'DAMAGED' | 'LOST';

const rental = {
  id: 'demo-rental-1',
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  owner: 'Nethmi Perera',
  dailyRate: 180,
  securityDeposit: 1000,
  pickupLocation: 'Colombo 07',
  borrowedFrom: '10 Sep 2026',
  dueDate: '17 Sep 2026',
};

const conditions: {
  value: Condition;
  title: string;
  description: string;
}[] = [
  {
    value: 'GOOD',
    title: 'Good condition',
    description: 'The book is returned in the same condition.',
  },
  {
    value: 'DAMAGED',
    title: 'Damaged',
    description: 'There is some damage that should be reported.',
  },
  {
    value: 'LOST',
    title: 'Lost',
    description: 'The physical book cannot be returned.',
  },
];

export default function ReturnBookClient() {
  const [condition, setCondition] = useState<Condition>('GOOD');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    [],
  );

  const isProblem = condition !== 'GOOD';

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    const previews = files
      .slice(0, 4 - photos.length)
      .map((file) => URL.createObjectURL(file));

    setPhotos((current) => [...current, ...previews]);
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6">
        <div className="bl-container flex min-h-[75vh] items-center justify-center">
          <section className="bl-card w-full max-w-xl p-7 text-center sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-soft)]">
              <CheckCircle2 className="h-9 w-9 text-[var(--green)]" />
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--green)]">
              Return submitted
            </p>

            <h1 className="text-3xl sm:text-4xl">
              Your return is being reviewed
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
              The lender will review the book condition. Your security deposit
              will be handled according to the final condition assessment.
            </p>

            <div className="mt-7 rounded-2xl bg-[var(--offwhite)] p-5 text-left">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)] text-white">
                  <BookOpen className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold text-[var(--navy)]">{rental.title}</p>
                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    Returned on {today}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[var(--ink-muted)]">Condition</p>
                  <p className="mt-1 font-semibold">
                    {condition === 'GOOD'
                      ? 'Good'
                      : condition === 'DAMAGED'
                        ? 'Damaged'
                        : 'Lost'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--ink-muted)]">Rating</p>
                  <p className="mt-1 font-semibold">
                    {rating > 0 ? `${rating}/5` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/rentals"
                className="bl-button bl-button-primary w-full sm:w-auto"
              >
                View My Rentals
              </Link>

              <Link
                href="/explore"
                className="bl-button bl-button-secondary w-full sm:w-auto"
              >
                Explore Books
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-28 md:pb-10">
      <div className="border-b border-[var(--border)] bg-white">
        <div className="bl-container flex h-16 items-center gap-4">
          <Link
            href="/rentals"
            aria-label="Back to rentals"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--navy)] transition hover:bg-[var(--offwhite)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              My Rentals
            </p>
            <h1 className="text-xl sm:text-2xl">Return Book</h1>
          </div>
        </div>
      </div>

      <div className="bl-container py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            {/* Book summary */}
            <div className="bl-card overflow-hidden">
              <div className="flex gap-4 p-5 sm:p-6">
                <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--navy-3)] to-[var(--navy)] text-white shadow-sm">
                  <BookOpen className="h-9 w-9" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 inline-flex rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--green)]">
                    ACTIVE RENTAL
                  </div>

                  <h2 className="text-2xl leading-tight">
                    {rental.title}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    by {rental.author}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[var(--gold)]" />
                      <div>
                        <p className="text-[var(--ink-muted)]">Borrowed</p>
                        <p className="font-semibold">{rental.borrowedFrom}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[var(--red)]" />
                      <div>
                        <p className="text-[var(--ink-muted)]">Due date</p>
                        <p className="font-semibold">{rental.dueDate}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                      <MapPin className="h-4 w-4 text-[var(--navy-3)]" />
                      <div>
                        <p className="text-[var(--ink-muted)]">Location</p>
                        <p className="font-semibold">{rental.pickupLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Condition */}
            <section className="bl-card p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                  Step 1
                </p>
                <h2 className="mt-1 text-2xl">What condition is the book in?</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  Be honest and accurate. This helps protect both the borrower
                  and lender.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {conditions.map((item) => {
                  const selected = condition === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCondition(item.value)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-[var(--navy)] bg-[var(--offwhite)]'
                          : 'border-[var(--border)] bg-white hover:bg-[var(--offwhite)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[var(--navy)] bg-[var(--navy)]'
                            : 'border-[var(--border)]'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </span>

                      <span>
                        <span className="block text-sm font-bold text-[var(--navy)]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="condition-notes"
                  className="text-sm font-bold text-[var(--navy)]"
                >
                  Condition notes
                  <span className="ml-1 font-normal text-[var(--ink-muted)]">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="condition-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder={
                    isProblem
                      ? 'Describe the damage or what happened to the book...'
                      : 'Anything the lender should know about the returned book?'
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--ink-muted)] focus:border-[var(--navy)]"
                />
              </div>
            </section>

            {/* Evidence */}
            <section className="bl-card p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                  Step 2
                </p>
                <h2 className="mt-1 text-2xl">Add condition photos</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  Photos are especially useful when reporting damage or loss.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo}
                    className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--offwhite)]"
                  >
                    <img
                      src={photo}
                      alt={`Condition evidence ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--navy)] text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {photos.length < 4 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--offwhite)] text-center transition hover:border-[var(--navy)] hover:bg-[var(--cream)]">
                    <ImagePlus className="h-7 w-7 text-[var(--navy-3)]" />
                    <span className="mt-2 text-xs font-bold text-[var(--navy)]">
                      Add photo
                    </span>
                    <span className="mt-1 text-[10px] text-[var(--ink-muted)]">
                      Up to 4
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl bg-[var(--offwhite)] p-4">
                <Upload className="mt-0.5 h-4 w-4 shrink-0 text-[var(--navy-3)]" />
                <p className="text-xs leading-5 text-[var(--ink-soft)]">
                  For a damaged or lost book, clear evidence can help BookLoop
                  resolve a dispute fairly.
                </p>
              </div>
            </section>

            {/* Rating */}
            <section className="bl-card p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                Step 3
              </p>

              <h2 className="mt-1 text-2xl">Rate the lending experience</h2>

              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                How was your experience borrowing from {rental.owner}?
              </p>

              <div className="mt-5 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    className="rounded-lg p-1 transition hover:bg-[var(--gold-soft)]"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= rating
                          ? 'fill-[var(--gold)] text-[var(--gold)]'
                          : 'text-[var(--cream-2)]'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <p className="mt-3 text-xs font-semibold text-[var(--ink-soft)]">
                  You selected {rating} out of 5 stars.
                </p>
              )}
            </section>

            {/* Submit */}
            <div className="hidden md:block">
              <button
                type="button"
                onClick={handleSubmit}
                className="bl-button bl-button-primary w-full py-3.5"
              >
                <CheckCircle2 className="h-5 w-5" />
                Submit Return
              </button>
            </div>
          </section>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bl-card p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                  Return summary
                </p>

                <h2 className="mt-1 text-2xl">{rental.title}</h2>

                <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink-soft)]">Return date</span>
                    <span className="font-semibold">{today}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink-soft)]">Condition</span>
                    <span className="font-semibold">
                      {condition === 'GOOD'
                        ? 'Good'
                        : condition === 'DAMAGED'
                          ? 'Damaged'
                          : 'Lost'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink-soft)]">Photos</span>
                    <span className="font-semibold">{photos.length}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bl-button bl-button-primary mt-6 w-full"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Submit Return
                </button>
              </div>

              <div className="rounded-2xl border border-[var(--green-soft)] bg-[var(--green-soft)] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--green)]" />

                  <div>
                    <p className="text-sm font-bold text-[var(--green)]">
                      Security deposit protection
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">
                      Your {rental.securityDeposit.toLocaleString()} LKR
                      security deposit is not automatically taken. It is
                      reviewed against the final condition assessment.
                    </p>
                  </div>
                </div>
              </div>

              {isProblem && (
                <div className="rounded-2xl border border-[var(--amber-soft)] bg-[var(--amber-soft)] p-5">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--amber)]" />

                    <div>
                      <p className="text-sm font-bold text-[var(--amber)]">
                        {condition === 'LOST'
                          ? 'Lost book reported'
                          : 'Damage reported'}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">
                        The lender may submit a claim. BookLoop can review
                        evidence before any security-deposit adjustment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile submit bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={handleSubmit}
          className="bl-button bl-button-primary w-full py-3.5"
        >
          <CheckCircle2 className="h-5 w-5" />
          Submit Return
        </button>
      </div>
    </main>
  );
}