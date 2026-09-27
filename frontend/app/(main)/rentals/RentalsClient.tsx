'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Search,
  WalletCards,
  X,
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
    id?: string;
    name?: string;
  };

  renter?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

type RentalsResponse = {
  success?: boolean;
  message?: string;
  rentals?: Rental[];
  data?: Rental[] | { rentals?: Rental[]; items?: Rental[] };
};

type Tab = 'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED';

type ViewMode = 'BORROWING' | 'LENDING';

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

  if (value === 'COMPLETED') {
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
    return status === 'COMPLETED';
  }

  return true;
}

export default function RentalsClient() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [viewMode, setViewMode] =
    useState<ViewMode>('BORROWING');

  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function loadRentals(mode: ViewMode = viewMode) {
    if (!getAccessToken()) {
      setError('Please sign in to view your rentals.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const endpoint =
        mode === 'BORROWING'
          ? '/rentals/my'
          : '/rentals/owner';

      const response = await apiRequest<RentalsResponse>(
        endpoint,
        {
          auth: true,
        },
      );

      setRentals(extractRentals(response));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load rentals.',
      );
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRentals(viewMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  async function performAction(
    rentalId: string,
    action: 'approve' | 'reject' | 'cancel',
  ) {
    const actionKey = `${action}-${rentalId}`;

    try {
      setActionLoading(actionKey);
      setError('');
      setSuccessMessage('');

      const endpoint = `/rentals/${rentalId}/${action}`;

      await apiRequest(endpoint, {
        method: 'PATCH',
        auth: true,
      });

      const messages = {
        approve: 'Rental request approved.',
        reject: 'Rental request rejected.',
        cancel: 'Rental request cancelled.',
      };

      setSuccessMessage(messages[action]);

      await loadRentals(viewMode);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `Unable to ${action} this rental.`,
      );
    } finally {
      setActionLoading('');
    }
  }

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rentals.filter((rental) => {
      const matchesStatus = matchesTab(rental, activeTab);

      const searchableText = [
        rental.book?.title,
        rental.book?.author,
        rental.owner?.name,
        rental.renter?.name,
        rental.renter?.email,
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
            Your BookLoop activity
          </p>

          <h1 className="text-4xl sm:text-5xl">
            My Rentals
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)] sm:text-base">
            Manage the books you borrow and the books you lend.
          </p>
        </div>

        {/* Borrowing / Lending switch */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setViewMode('BORROWING');
              setActiveTab('ALL');
              setSearch('');
              setSuccessMessage('');
              setError('');
            }}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              viewMode === 'BORROWING'
                ? 'bg-[var(--navy)] text-white shadow-sm'
                : 'text-[var(--ink-soft)] hover:bg-[var(--cream)]'
            }`}
          >
            Books I'm borrowing
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('LENDING');
              setActiveTab('ALL');
              setSearch('');
              setSuccessMessage('');
              setError('');
            }}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              viewMode === 'LENDING'
                ? 'bg-[var(--navy)] text-white shadow-sm'
                : 'text-[var(--ink-soft)] hover:bg-[var(--cream)]'
            }`}
          >
            Books I'm lending
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-[var(--red)]/20 bg-[var(--red-soft)] px-5 py-4 text-sm font-semibold text-[var(--red)]">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-2xl border border-[var(--green)]/20 bg-[var(--green-soft)] px-5 py-4 text-sm font-semibold text-[var(--green)]">
            {successMessage}
          </div>
        )}

        {/* KPI cards */}
        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="bl-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-soft)]">
                Active
              </p>

              <Clock3
                size={18}
                className="text-[var(--green)]"
              />
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

              <WalletCards
                size={18}
                className="text-[var(--amber)]"
              />
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

        {/* Filters */}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search rentals..."
              className="w-full rounded-xl border border-[var(--border)] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--navy)]"
            />
          </div>
        </div>

        {/* Empty state */}
        {filteredRentals.length === 0 ? (
          <div className="bl-card px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cream)]">
              <WalletCards
                size={24}
                className="text-[var(--navy)]"
              />
            </div>

            <h2 className="mt-5 text-2xl">
              No rentals found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
              {search
                ? 'Try a different search term.'
                : viewMode === 'BORROWING'
                  ? 'Explore the catalogue and request your first book.'
                  : 'When someone requests one of your books, the request will appear here.'}
            </p>

            {!search && viewMode === 'BORROWING' && (
              <Link
                href="/explore"
                className="bl-button bl-button-primary mt-6"
              >
                Explore books
              </Link>
            )}

            {!search && viewMode === 'LENDING' && (
              <Link
                href="/list-book"
                className="bl-button bl-button-primary mt-6"
              >
                List a book
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

              const status = normaliseStatus(
                rental.status,
              );

              const isReturnAction = [
                'ACTIVE',
                'OVERDUE',
              ].includes(status);

              const isRequested =
                status === 'REQUESTED';

              const isApproved =
                status === 'APPROVED';

              const isPendingPayment =
                status === 'PAYMENT_PENDING';

              const isActionRunning = actionLoading.includes(
                rental.id,
              );

              return (
                <div
                  key={rental.id}
                  className="bl-card overflow-hidden p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* Book cover */}
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

                    {/* Main information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl">
                          {bookTitle}
                        </h2>

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

                      {viewMode === 'BORROWING' &&
                        rental.owner?.name && (
                          <p className="mt-3 text-xs text-[var(--ink-soft)]">
                            Owner: {rental.owner.name}
                          </p>
                        )}

                      {viewMode === 'LENDING' &&
                        rental.renter?.name && (
                          <p className="mt-3 text-xs text-[var(--ink-soft)]">
                            Borrower: {rental.renter.name}
                          </p>
                        )}

                      {viewMode === 'LENDING' &&
                        rental.renter?.email && (
                          <p className="mt-1 text-xs text-[var(--ink-soft)]">
                            {rental.renter.email}
                          </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-2 lg:w-44">
                      {/* OWNER REQUEST ACTIONS */}
                      {viewMode === 'LENDING' &&
                        isRequested && (
                          <>
                            <button
                              type="button"
                              disabled={isActionRunning}
                              onClick={() =>
                                void performAction(
                                  rental.id,
                                  'approve',
                                )
                              }
                              className="bl-button bl-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check size={15} />

                              {actionLoading ===
                              `approve-${rental.id}`
                                ? 'Approving...'
                                : 'Approve'}
                            </button>

                            <button
                              type="button"
                              disabled={isActionRunning}
                              onClick={() =>
                                void performAction(
                                  rental.id,
                                  'reject',
                                )
                              }
                              className="bl-button w-full border border-[var(--red)] bg-transparent text-[var(--red)] hover:bg-[var(--red-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <X size={15} />

                              {actionLoading ===
                              `reject-${rental.id}`
                                ? 'Rejecting...'
                                : 'Reject'}
                            </button>
                          </>
                        )}

                      {/* PAYMENT STATE */}
                      {viewMode === 'BORROWING' &&
                        isApproved && (
                          <Link
                            href={`/rentals/${rental.id}`}
                            className="bl-button bl-button-primary w-full"
                          >
                            Continue
                            <ArrowRight size={15} />
                          </Link>
                        )}

                      {viewMode === 'BORROWING' &&
                        isPendingPayment && (
                          <Link
                            href={`/rentals/${rental.id}`}
                            className="bl-button bl-button-primary w-full"
                          >
                            Complete payment
                            <ArrowRight size={15} />
                          </Link>
                        )}

                      {/* BORROWER RETURN */}
                      {viewMode === 'BORROWING' &&
                        isReturnAction && (
                          <Link
                            href={`/rentals/${rental.id}/return`}
                            className="bl-button bl-button-primary w-full"
                          >
                            Return book
                          </Link>
                        )}

                      {/* BORROWER CANCEL */}
                      {viewMode === 'BORROWING' &&
                        isRequested && (
                          <button
                            type="button"
                            disabled={isActionRunning}
                            onClick={() =>
                              void performAction(
                                rental.id,
                                'cancel',
                              )
                            }
                            className="bl-button w-full border border-[var(--border)] bg-white text-[var(--ink-soft)] hover:bg-[var(--cream)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading ===
                            `cancel-${rental.id}`
                              ? 'Cancelling...'
                              : 'Cancel request'}
                          </button>
                        )}

                      {/* VIEW RENTAL */}
                      <Link
                        href={`/rentals/${rental.id}`}
                        className="bl-button bl-button-outline w-full"
                      >
                        View rental
                        <ArrowRight size={15} />
                      </Link>

                      {/* VIEW BOOK */}
                      {rental.book?.id && (
                        <Link
                          href={`/book/${rental.book.id}`}
                          className="bl-button w-full border border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)]"
                        >
                          View book
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