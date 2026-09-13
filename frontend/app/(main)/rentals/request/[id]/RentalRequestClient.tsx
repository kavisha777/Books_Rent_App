'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  LockKeyhole,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

const book = {
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  category: 'Self Development',
  dailyRate: 150,
  securityDeposit: 3000,
  owner: 'Maya Fernando',
  location: 'Moratuwa, Colombo',
  rating: 4.9,
};

const durations = [3, 5, 7, 14, 21, 30];

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RentalRequestClient() {
  const [duration, setDuration] = useState(7);
  const [showDurations, setShowDurations] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startDate = useMemo(() => new Date(), []);

  const endDate = useMemo(() => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return date;
  }, [startDate, duration]);

  const rentalAmount = book.dailyRate * duration;
  const total = rentalAmount + book.securityDeposit;

  function handleRequest() {
    // Backend rental-request integration will be added later.
    setSubmitted(true);
  }

  if (submitted) {
    return <RequestSuccess />;
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      {/* Header */}
      <header className="border-b border-[#e3d8c0] bg-[#fbf7ef]">
        <div className="bl-container flex h-16 items-center justify-between">
          <Link
            href={`/book/demo-book`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#17273f]"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <LockKeyhole size={18} className="text-[#3f7a57]" />
            <span className="text-sm font-semibold text-[#17273f]">
              Secure request
            </span>
          </div>

          <div className="w-[52px]" />
        </div>
      </header>

      <div className="bl-container py-6 md:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8862f]">
              Rental request
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl">
              Ready for your next read?
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b6673]">
              Choose how long you would like to keep the book. Your request
              will only become confirmed after the owner approves it and
              payment is completed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
            {/* Main content */}
            <div className="space-y-5">
              {/* Book summary */}
              <section className="bl-card p-5 md:p-6">
                <div className="flex gap-4">
                  <div className="book-cover cover-one h-32 w-24 shrink-0">
                    <div className="book-cover-content p-2.5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em]">
                        Money
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-tight">
                        The Psychology
                        <br />
                        of Money
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 py-1">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b8862f]">
                      {book.category}
                    </p>

                    <h2 className="mt-1 text-2xl leading-tight">
                      {book.title}
                    </h2>

                    <p className="mt-1 text-sm text-[#5b6673]">
                      by {book.author}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#5b6673]">
                      <span>★ {book.rating}</span>
                      <span>•</span>
                      <span>Rs. {book.dailyRate}/day</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Duration */}
              <section className="bl-card p-5 md:p-6">
                <div className="mb-5">
                  <h2 className="text-xl">Rental duration</h2>
                  <p className="mt-1 text-sm text-[#5b6673]">
                    Select how many days you need the book.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {durations.map((days) => {
                    const selected = duration === days;

                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDuration(days)}
                        className={`rounded-xl border px-2 py-3 text-center transition ${
                          selected
                            ? 'border-[#17273f] bg-[#17273f] text-white'
                            : 'border-[#e3d8c0] bg-white text-[#17273f] hover:border-[#b8862f]'
                        }`}
                      >
                        <span className="block text-sm font-bold">
                          {days}
                        </span>

                        <span
                          className={`mt-0.5 block text-[10px] ${
                            selected
                              ? 'text-white/70'
                              : 'text-[#9aa3ae]'
                          }`}
                        >
                          days
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom duration dropdown */}
                <div className="relative mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDurations(!showDurations)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-left text-sm"
                  >
                    <span className="text-[#5b6673]">
                      Selected duration
                    </span>

                    <span className="flex items-center gap-2 font-bold text-[#17273f]">
                      {duration} days
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {showDurations && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-[#e3d8c0] bg-white p-1 shadow-lg">
                      {durations.map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => {
                            setDuration(days);
                            setShowDurations(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-[#fbf7ef]"
                        >
                          <span>{days} days</span>

                          {duration === days && (
                            <Check size={16} className="text-[#3f7a57]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Dates */}
              <section className="bl-card p-5 md:p-6">
                <div className="mb-5">
                  <h2 className="text-xl">Rental dates</h2>
                  <p className="mt-1 text-sm text-[#5b6673]">
                    These dates are calculated from your selected duration.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DateCard
                    label="Pickup"
                    date={formatDate(startDate)}
                    icon={<CalendarDays size={18} />}
                  />

                  <DateCard
                    label="Expected return"
                    date={formatDate(endDate)}
                    icon={<Clock3 size={18} />}
                  />
                </div>
              </section>

              {/* Pickup */}
              <section className="bl-card p-5 md:p-6">
                <div className="mb-5">
                  <h2 className="text-xl">Pickup information</h2>
                  <p className="mt-1 text-sm text-[#5b6673]">
                    Exact handover details will be shared after the request is
                    approved.
                  </p>
                </div>

                <div className="flex gap-3 rounded-xl bg-[#fbf7ef] p-4">
                  <MapPin
                    size={20}
                    className="mt-0.5 shrink-0 text-[#b8862f]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#17273f]">
                      {book.location}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5b6673]">
                      Owner: {book.owner}
                    </p>
                  </div>
                </div>
              </section>

              {/* Safety */}
              <section className="rounded-2xl border border-[#e4efe7] bg-[#e4efe7] p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-[#3f7a57]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#17273f]">
                      BookLoop protection
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#5b6673]">
                      Your security deposit is refundable after the book is
                      returned and its condition is verified. Any damage claim
                      must follow BookLoop&apos;s dispute process.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Checkout summary */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="bl-card overflow-hidden">
                <div className="bg-[#17273f] p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f3e4c4]">
                    Request summary
                  </p>

                  <h2 className="mt-2 text-2xl text-white">
                    Review your rental
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <PriceRow
                      label={`Rs. ${book.dailyRate} × ${duration} days`}
                      value={`Rs. ${rentalAmount.toLocaleString()}`}
                    />

                    <PriceRow
                      label="Security deposit"
                      value={`Rs. ${book.securityDeposit.toLocaleString()}`}
                    />

                    <div className="border-t border-[#e3d8c0] pt-4">
                      <div className="flex items-end justify-between gap-4">
                        <span className="text-sm font-semibold text-[#5b6673]">
                          Estimated total
                        </span>

                        <span className="text-2xl font-bold text-[#17273f]">
                          Rs. {total.toLocaleString()}
                        </span>
                      </div>

                      <p className="mt-1 text-right text-[11px] text-[#9aa3ae]">
                        Includes refundable deposit
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRequest}
                    className="bl-button bl-button-primary mt-6 w-full py-3.5"
                  >
                    Send rental request
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-4 text-[#9aa3ae]">
                    No payment is taken at this stage. The owner must approve
                    your request first.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile fixed action */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e3d8c0] bg-[#fbf7ef]/95 p-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-[#5b6673]">
                  {duration} days · deposit included
                </p>

                <p className="text-base font-bold text-[#17273f]">
                  Rs. {total.toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRequest}
                className="bl-button bl-button-primary shrink-0 px-5"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </main>
  );
}

function DateCard({
  label,
  date,
  icon,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e3d8c0] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3e4c4] text-[#b8862f]">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9aa3ae]">
          {label}
        </p>

        <p className="mt-1 text-sm font-bold text-[#17273f]">{date}</p>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#5b6673]">{label}</span>
      <span className="font-semibold text-[#17273f]">{value}</span>
    </div>
  );
}

function RequestSuccess() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
      <div className="bl-card w-full max-w-lg p-8 text-center md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e4efe7] text-[#3f7a57]">
          <Check size={30} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#3f7a57]">
          Request sent
        </p>

        <h1 className="mt-2 text-3xl">Your rental request is on its way.</h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5b6673]">
          The owner will need to approve your request before the rental can
          continue to payment and confirmation.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/rentals"
            className="bl-button bl-button-primary"
          >
            View my rentals
          </Link>

          <Link
            href="/explore"
            className="bl-button bl-button-secondary"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </main>
  );
}