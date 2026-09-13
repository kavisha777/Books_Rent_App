'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';

const book = {
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  category: 'Finance',
  description:
    'Doing well with money is not necessarily about what you know. It is about how you behave. This book explores the psychology behind our relationship with money, wealth and financial decisions.',
  isbn: '9780857197689',
  language: 'English',
  published: '2020',
  condition: 'Good',
  rating: 4.8,
  reviewCount: 124,
  dailyRate: 150,
  securityDeposit: 1000,
  owner: {
    name: 'Nethmi Perera',
    rating: 4.9,
    rentals: 28,
    location: 'Colombo',
  },
};

const reviews = [
  {
    name: 'Kavindu',
    rating: 5,
    text: 'The book was in great condition and the owner was very helpful.',
  },
  {
    name: 'Sarah',
    rating: 5,
    text: 'Smooth rental experience. Everything was exactly as described.',
  },
  {
    name: 'Tharushi',
    rating: 4,
    text: 'Really useful book and the return process was straightforward.',
  },
];

export default function BookDetailsClient() {
  const [days, setDays] = useState(7);
  const [liked, setLiked] = useState(false);

  const rentalAmount = useMemo(
    () => book.dailyRate * days,
    [days],
  );

  const estimatedTotal = rentalAmount + book.securityDeposit;

  return (
    <main className="min-h-screen bg-[#fbf7ef] pb-28 md:pb-10">
      <div className="bl-container py-5 md:py-8">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#5b6673] transition hover:text-[#17273f]"
        >
          <ArrowLeft size={16} />
          Back to catalogue
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section>
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="relative">
                <div className="book-cover cover-one aspect-[4/5] min-h-[390px] rounded-3xl shadow-lg">
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-[#e4efe7] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#3f7a57]">
                    Available
                  </div>

                  <div className="book-cover-content p-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                      BookLoop
                    </p>

                    <p className="text-3xl font-semibold leading-tight">
                      The Psychology
                      <br />
                      of Money
                    </p>

                    <p className="mt-3 text-sm text-white/75">
                      Morgan Housel
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLiked((value) => !value)}
                  className="absolute right-4 top-4 rounded-full bg-white/95 p-3 text-[#17273f] shadow-md transition hover:scale-105"
                  aria-label="Add to favourites"
                >
                  <Heart
                    size={19}
                    fill={liked ? 'currentColor' : 'none'}
                    className={liked ? 'text-[#b14a3d]' : ''}
                  />
                </button>
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8862f]">
                  {book.category}
                </p>

                <h1 className="mt-2 text-4xl leading-tight md:text-5xl">
                  {book.title}
                </h1>

                <p className="mt-2 text-base text-[#5b6673]">
                  by {book.author}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star
                      size={17}
                      fill="currentColor"
                      className="text-[#b8862f]"
                    />
                    <span className="text-sm font-extrabold text-[#17273f]">
                      {book.rating}
                    </span>
                    <span className="text-xs text-[#9aa3ae]">
                      ({book.reviewCount} reviews)
                    </span>
                  </div>

                  <span className="h-1 w-1 rounded-full bg-[#e3d8c0]" />

                  <span className="text-xs font-semibold text-[#3f7a57]">
                    {book.condition} condition
                  </span>
                </div>

                <div className="mt-7 border-t border-[#e3d8c0] pt-6">
                  <h2 className="text-2xl">About this book</h2>

                  <p className="mt-3 text-sm leading-7 text-[#5b6673]">
                    {book.description}
                  </p>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <InfoItem label="ISBN" value={book.isbn} />
                  <InfoItem label="Language" value={book.language} />
                  <InfoItem label="Published" value={book.published} />
                  <InfoItem label="Condition" value={book.condition} />
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-[#e3d8c0] bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl">Book owner</h2>
                  <p className="mt-1 text-xs text-[#9aa3ae]">
                    Your rental is arranged directly with the owner.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e4c4] text-[#17273f]">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#17273f]">
                      {book.owner.name}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#5b6673]">
                      <span className="flex items-center gap-1">
                        <Star
                          size={13}
                          fill="currentColor"
                          className="text-[#b8862f]"
                        />
                        {book.owner.rating}
                      </span>

                      <span>{book.owner.rentals} rentals</span>

                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {book.owner.location}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-[#17273f] px-4 py-2.5 text-xs font-extrabold text-[#17273f] transition hover:bg-[#17273f] hover:text-white"
                >
                  View profile
                </button>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8862f]">
                    Reader feedback
                  </p>
                  <h2 className="mt-1 text-3xl">Recent reviews</h2>
                </div>

                <span className="text-xs font-bold text-[#5b6673]">
                  {book.reviewCount} total
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-2xl border border-[#e3d8c0] bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-extrabold text-[#17273f]">
                        {review.name}
                      </p>

                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={13}
                            fill="currentColor"
                            className={
                              index < review.rating
                                ? 'text-[#b8862f]'
                                : 'text-[#e3d8c0]'
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-[#5b6673]">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="hidden lg:block">
            <RentalCard
              days={days}
              setDays={setDays}
              rentalAmount={rentalAmount}
              estimatedTotal={estimatedTotal}
            />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e3d8c0] bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#9aa3ae]">
              Rental from
            </p>
            <p className="text-sm font-extrabold text-[#17273f]">
              Rs. {book.dailyRate} / day
            </p>
          </div>

          <Link
            href={`/rentals/request/demo-book`}
            className="bl-button bl-button-primary px-5"
          >
            Request to rent
          </Link>
        </div>
      </div>
    </main>
  );
}

function RentalCard({
  days,
  setDays,
  rentalAmount,
  estimatedTotal,
}: {
  days: number;
  setDays: (days: number) => void;
  rentalAmount: number;
  estimatedTotal: number;
}) {
  return (
    <div className="sticky top-24 rounded-3xl border border-[#e3d8c0] bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#b8862f]">
          Rental
        </p>

        <div className="mt-2 flex items-end gap-1">
          <span className="text-3xl font-extrabold text-[#17273f]">
            Rs. {book.dailyRate}
          </span>
          <span className="mb-1 text-xs text-[#9aa3ae]">/ day</span>
        </div>
      </div>

      <div className="my-6 border-t border-[#e3d8c0]" />

      <div>
        <label className="mb-2 block text-xs font-extrabold text-[#17273f]">
          Rental period
        </label>

        <div className="relative">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="w-full appearance-none rounded-xl border border-[#e3d8c0] bg-[#fbf7ef] px-4 py-3 pr-10 text-sm font-semibold text-[#17273f] outline-none focus:border-[#b8862f]"
          >
            <option value={3}>3 days</option>
            <option value={5}>5 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={21}>21 days</option>
            <option value={30}>30 days</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9aa3ae]"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl bg-[#fbf7ef] p-4">
        <PriceRow
          label={`Rental (${days} days)`}
          value={`Rs. ${rentalAmount}`}
        />

        <PriceRow
          label="Security deposit"
          value={`Rs. ${book.securityDeposit}`}
        />

        <div className="border-t border-[#e3d8c0] pt-3">
          <PriceRow
            label="Estimated total"
            value={`Rs. ${estimatedTotal}`}
            strong
          />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#e4efe7] p-3">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-[#3f7a57]"
        />

        <p className="text-[11px] leading-5 text-[#3f7a57]">
          The security deposit is held during the rental and returned after
          the book passes the return inspection.
        </p>
      </div>

      <Link
        href="/rentals/request/demo-book"
        className="bl-button bl-button-primary mt-5 w-full"
      >
        Request to rent
      </Link>

      <p className="mt-3 text-center text-[10px] leading-4 text-[#9aa3ae]">
        You will only be charged after the owner approves your request.
      </p>

      <div className="mt-6 space-y-3 border-t border-[#e3d8c0] pt-5">
        <TrustRow
          icon={<ShieldCheck size={16} />}
          title="Secure rental flow"
          text="Payment is protected through BookLoop."
        />

        <TrustRow
          icon={<CalendarDays size={16} />}
          title="Flexible rental period"
          text="Choose the duration that works for you."
        />

        <TrustRow
          icon={<CheckCircle2 size={16} />}
          title="Return protection"
          text="Condition is checked before the deposit is released."
        />
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-xs ${
          strong ? 'font-extrabold text-[#17273f]' : 'text-[#5b6673]'
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xs ${
          strong ? 'font-extrabold text-[#17273f]' : 'font-semibold text-[#17273f]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3e4c4] text-[#b8862f]">
        {icon}
      </div>

      <div>
        <p className="text-xs font-extrabold text-[#17273f]">{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-[#9aa3ae]">
          {text}
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f0e6d2] p-3">
      <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#9aa3ae]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-[#17273f]">
        {value}
      </p>
    </div>
  );
}