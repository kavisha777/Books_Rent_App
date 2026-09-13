'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  WalletCards,
} from 'lucide-react';

import { apiRequest } from '../../../lib/api';
import { getAccessToken } from '../../../lib/auth';

type Rental = {
  id: string;
  status: string;
  startDate?: string;
  endDate?: string;
  rentalAmount?: number;
  securityDeposit?: number;
  book?: {
    id?: string;
    title?: string;
    author?: string;
    coverImage?: string;
    imageUrl?: string;
  };
  owner?: {
    name?: string;
  };
};

type RentalsResponse = {
  success?: boolean;
  message?: string;
  rentals?: Rental[];
  data?: Rental[] | { rentals?: Rental[]; items?: Rental[] };
};

type Tab = 'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED';

function extractRentals(response: RentalsResponse): Rental[] {
  if (Array.isArray(response.rentals)) {
    return response.rentals;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data?.rentals) {
    return response.data.rentals;
  }

  if (response.data?.items) {
    return response.data.items;
  }

  return [];
}

function formatDate(date?: string) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function normaliseStatus(status: string) {
  return status.toUpperCase().replace(/-/g, '_');
}

function statusLabel(status: string) {
  return normaliseStatus(status)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  const value = normaliseStatus(status);

  if (
    ['ACTIVE', 'CONFIRMED', 'HANDOVER_PENDING'].includes(value)
  ) {
    return 'bg-[var(--green-soft)] text-[var(--green)]';
  }

  if (
    ['REQUESTED', 'APPROVED', 'PAYMENT_PENDING'].includes(value)
  ) {
    return 'bg-[var(--amber-soft)] text-[var(--amber)]';
  }

  if (['COMPLETED'].includes(value)) {
    return 'bg-[var(--cream)] text-[var(--navy)]';
  }

  if (
    ['RETURN_PENDING', 'INSPECTION', 'OVERDUE', 'DISPUTED'].includes(
      value,
    )
  ) {
    return 'bg-[var(--red-soft)] text-[var(--red)]';
  }

  return 'bg-[var(--cream)] text-[var(--ink-soft)]';
}

function matchesTab(rental: Rental, tab: Tab) {
  const status = normaliseStatus(rental.status);

  if (tab === 'ALL') return true;

  if (tab === 'ACTIVE') {
    return [
      'CONFIRMED',
      'HANDOVER_PENDING',
      'ACTIVE',
      'RETURN_PENDING',
      'INSPECTION',
      'OVERDUE',
      'DISPUTED',
    ].includes(status);
  }

  if (tab === 'PENDING') {
    return [
      'REQUESTED',
      'APPROVED',
      'PAYMENT_PENDING',
    ].includes(status);
  }

  if (tab === 'COMPLETED') {
    return ['COMPLETED'].includes(status);
  }

  return true;
}

export default function RentalsClient() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadRentals() {
      if (!getAccessToken()) {
        setError('Please sign in to view your rentals.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<RentalsResponse>(
          '/rentals',
          {
            auth: true,
          },
        );

        if (!mounted) return;

        setRentals(extractRentals(response));
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load your rentals.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadRentals();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rentals.filter((rental) => {
      const matchesStatus = matchesTab(rental, activeTab);

      const searchableText = [
        rental.book?.title,
        rental.book?.author,
        rental.owner?.name,
        rental.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        matchesStatus &&
        (!query || searchableText.includes(query))
      );
    });
  }, [rentals, activeTab, search]);

  const activeCount = rentals.filter((rental) =>
    matchesTab(rental, 'ACTIVE'),
  ).length;

  const pendingCount = rentals.filter((rental) =>
    matchesTab(rental, 'PENDING'),
  ).length;

  const completedCount = rentals.filter((rental) =>
    matchesTab(rental, 'COMPLETED'),
  ).length;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-72px)] px-4 py-10">
        <div className="bl-container">
          <div className="animate-pulse">
            <div className="h-10 w-64 rounded bg-[var(--cream)]" />
            <div className="mt-3 h-5 w-80 rounded bg-[var(--cream)]" />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl bg-[var(--cream)]"
                />
              ))}
            </div>

            <div className="mt-6 h-96 rounded-2xl bg-[var(--cream)]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] pb-12">
      <div className="bl-container pt-6 sm:pt-10">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Your reading journey
          </p>

          <h1 className="text-4xl sm:text-5xl">My Rentals</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
            Keep track of your current books, rental requests and
            completed reads.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-[var(--red)]/20 bg-[var(--red-soft)] px-5 py-4 text-sm font-semibold text-[var(--red)]">
            {error}
          </div>
        )}

        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="bl-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Active
              </p>

              <Clock3 size={18} className="text-[var(--green)]" />
            </div>

            <p className="mt-3 font-serif text-3xl text-[var(--navy)]">
              {activeCount}
            </p>
          </div>

          <div className="bl-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Pending
              </p>

              <WalletCards size={18} className="text-[var(--amber)]" />
            </div>

            <p className="mt-3 font-serif text-3xl text-[var(--navy)]">
              {pendingCount}
            </p>
          </div>

          <div className="bl-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Completed
              </p>

              <CalendarDays
                size={18}
                className="text-[var(--navy)]"
              />
            </div>

            <p className="mt-3 font-serif text-3xl text-[var(--navy)]">
              {completedCount}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex overflow-x-auto rounded-xl bg-[var(--cream)] p-1">
            {(
              [
                ['ALL', 'All'],
                ['ACTIVE', 'Active'],
                ['PENDING', 'Pending'],
                ['COMPLETED', 'Completed'],
              ] as [Tab, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                  activeTab === value
                    ? 'bg-white text-[var(--navy)] shadow-sm'
                    : 'text-[var(--ink-soft)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative lg:w-72">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your rentals..."
              className="w-full rounded-xl border border-[var(--border)] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--navy)]"
            />
          </div>
        </div>

        {filteredRentals.length === 0 ? (
          <div className="bl-card px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cream)]">
              <WalletCards
                size={24}
                className="text-[var(--navy)]"
              />
            </div>

            <h2 className="mt-5 text-2xl">No rentals found</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
              {search
                ? 'Try a different search term.'
                : 'Explore the catalogue and request your first book.'}
            </p>

            {!search && (
              <Link
                href="/explore"
                className="bl-button bl-button-primary mt-6"
              >
                Explore books
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRentals.map((rental) => {
              const bookTitle =
                rental.book?.title || 'Untitled book';

              const bookAuthor =
                rental.book?.author || 'Unknown author';

              const isReturnAction =
                ['ACTIVE', 'RETURN_PENDING', 'OVERDUE'].includes(
                  normaliseStatus(rental.status),
                );

              return (
                <div
                  key={rental.id}
                  className="bl-card overflow-hidden p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="book-cover cover-one h-32 w-24 shrink-0">
                      <div className="book-cover-content p-2">
                        <p className="text-[9px] font-bold uppercase tracking-wide">
                          BookLoop
                        </p>

                        <p className="mt-1 text-xs font-semibold leading-tight">
                          {bookTitle}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl">{bookTitle}</h2>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass(
                            rental.status,
                          )}`}
                        >
                          {statusLabel(rental.status)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[var(--ink-soft)]">
                        {bookAuthor}
                      </p>

                      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
                        <div>
                          <p className="font-bold uppercase tracking-wide text-[var(--ink-muted)]">
                            Rental period
                          </p>
                          <p className="mt-1 font-semibold text-[var(--navy)]">
                            {formatDate(rental.startDate)} —{' '}
                            {formatDate(rental.endDate)}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold uppercase tracking-wide text-[var(--ink-muted)]">
                            Rental amount
                          </p>
                          <p className="mt-1 font-semibold text-[var(--navy)]">
                            LKR{' '}
                            {Number(
                              rental.rentalAmount || 0,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold uppercase tracking-wide text-[var(--ink-muted)]">
                            Security deposit
                          </p>
                          <p className="mt-1 font-semibold text-[var(--navy)]">
                            LKR{' '}
                            {Number(
                              rental.securityDeposit || 0,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {rental.owner?.name && (
                        <p className="mt-3 text-xs text-[var(--ink-soft)]">
                          Owner: {rental.owner.name}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:w-36">
                      {isReturnAction && (
                        <Link
                          href={`/rentals/${rental.id}/return`}
                          className="bl-button bl-button-primary w-full"
                        >
                          Return book
                        </Link>
                      )}

                      {rental.book?.id && (
                        <Link
                          href={`/book/${rental.book.id}`}
                          className="bl-button bl-button-outline w-full"
                        >
                          View book
                          <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}