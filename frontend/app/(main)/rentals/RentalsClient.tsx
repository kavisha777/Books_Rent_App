'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';

type RentalStatus =
  | 'ACTIVE'
  |  'PENDING'
  |  'COMPLETED'
  | 'RETURN_PENDING';

type Rental = {
  id: string;
  title: string;
  author: string;
  category: string;
  owner: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  rentalAmount: number;
  securityDeposit: number;
  status: RentalStatus;
  rating?: number;
  cover: string;
};

const rentals: Rental[] = [
  {
    id: 'rental-001',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Self Development',
    owner: 'Maya Fernando',
    location: 'Moratuwa, Colombo',
    startDate: '13 Sep 2026',
    endDate: '20 Sep 2026',
    duration: 7,
    rentalAmount: 1050,
    securityDeposit: 3000,
    status: 'ACTIVE',
    cover: 'cover-one',
  },
  {
    id: 'rental-002',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    owner: 'Nethmi Perera',
    location: 'Dehiwala, Colombo',
    startDate: '18 Sep 2026',
    endDate: '25 Sep 2026',
    duration: 7,
    rentalAmount: 980,
    securityDeposit: 2500,
    status: 'PENDING',
    cover: 'cover-two',
  },
  {
    id: 'rental-003',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity',
    owner: 'Ravindu Silva',
    location: 'Kaduwela, Colombo',
    startDate: '01 Aug 2026',
    endDate: '15 Aug 2026',
    duration: 14,
    rentalAmount: 2100,
    securityDeposit: 3500,
    status: 'COMPLETED',
    rating: 5,
    cover: 'cover-three',
  },
  {
    id: 'rental-004',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    owner: 'Dinuka Jayasinghe',
    location: 'Nugegoda, Colombo',
    startDate: '03 Sep 2026',
    endDate: '10 Sep 2026',
    duration: 7,
    rentalAmount: 840,
    securityDeposit: 2000,
    status: 'RETURN_PENDING',
    cover: 'cover-four',
  },
];

const tabs = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function RentalsClient() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      const matchesTab =
        activeTab === 'ALL' || rental.status === activeTab;

      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !search ||
        rental.title.toLowerCase().includes(search) ||
        rental.author.toLowerCase().includes(search) ||
        rental.owner.toLowerCase().includes(search);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const activeCount = rentals.filter(
    (rental) => rental.status === 'ACTIVE',
  ).length;

  const pendingCount = rentals.filter(
    (rental) => rental.status === 'PENDING',
  ).length;

  const completedCount = rentals.filter(
    (rental) => rental.status === 'COMPLETED',
  ).length;

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      <div className="bl-container py-7 pb-24 md:py-10">
        {/* Heading */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b8862f]">
              Your reading journey
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl">My rentals</h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5b6673]">
              Keep track of the books you are borrowing, returning and
              discovering through BookLoop.
            </p>
          </div>

          <Link
            href="/explore"
            className="bl-button bl-button-primary w-full md:w-auto"
          >
            Find another book
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* KPI cards */}
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Total rentals"
            value={rentals.length}
            icon={<BookOpen size={18} />}
          />

          <StatCard
            label="Active"
            value={activeCount}
            icon={<Clock3 size={18} />}
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<CalendarDays size={18} />}
          />

          <StatCard
            label="Completed"
            value={completedCount}
            icon={<Star size={18} />}
          />
        </div>

        {/* Search + tabs */}
        <div className="mt-8">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa3ae]"
            />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your rentals..."
              className="w-full rounded-xl border border-[#e3d8c0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9aa3ae] focus:border-[#2c4c6e] focus:ring-2 focus:ring-[#2c4c6e]/10"
            />
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const selected = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                    selected
                      ? 'bg-[#17273f] text-white'
                      : 'border border-[#e3d8c0] bg-white text-[#5b6673] hover:border-[#b8862f]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rental list */}
        <div className="mt-6">
          {filteredRentals.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </main>
  );
}

function RentalCard({ rental }: { rental: Rental }) {
  const canReturn =
    rental.status === 'ACTIVE' || rental.status === 'RETURN_PENDING';

  return (
    <article className="bl-card overflow-hidden">
      <div className="p-4 md:p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={rental.status} />

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b6673] transition hover:bg-[#fbf7ef] hover:text-[#17273f]"
            aria-label="View rental details"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Book */}
        <div className="mt-4 flex gap-4">
          <div className={`book-cover ${rental.cover} h-32 w-24 shrink-0`}>
            <div className="book-cover-content p-2.5">
              <p className="text-[8px] font-bold uppercase tracking-[0.12em]">
                BookLoop
              </p>

              <p className="mt-1 text-sm font-semibold leading-tight">
                {rental.title}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#b8862f]">
              {rental.category}
            </p>

            <h2 className="mt-1 line-clamp-2 text-xl leading-tight">
              {rental.title}
            </h2>

            <p className="mt-1 text-sm text-[#5b6673]">
              {rental.author}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#5b6673]">
              <MapPin size={13} />
              <span className="truncate">{rental.location}</span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <InfoBox
            label="Start date"
            value={rental.startDate}
            icon={<CalendarDays size={15} />}
          />

          <InfoBox
            label="Return date"
            value={rental.endDate}
            icon={<Clock3 size={15} />}
          />
        </div>

        {/* Owner + pricing */}
        <div className="mt-4 flex flex-col gap-3 border-t border-[#e3d8c0] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#9aa3ae]">
              Owner
            </p>

            <p className="mt-1 text-sm font-semibold text-[#17273f]">
              {rental.owner}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#9aa3ae]">
              Rental amount
            </p>

            <p className="mt-1 text-lg font-bold text-[#17273f]">
              Rs. {rental.rentalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="bl-button bl-button-secondary flex-1"
          >
            View details
            <ChevronRight size={15} />
          </button>

          {canReturn && (
            <Link
              href={`/rentals/${rental.id}/return`}
              className="bl-button bl-button-outline flex-1"
            >
              <RotateCcw size={15} />
              Return book
            </Link>
          )}
        </div>
      </div>

      {/* Deposit notice */}
      {rental.status === 'ACTIVE' && (
        <div className="flex items-center gap-2 border-t border-[#e3d8c0] bg-[#fbf7ef] px-5 py-3">
          <ShieldCheck size={15} className="text-[#3f7a57]" />

          <p className="text-[11px] leading-4 text-[#5b6673]">
            Rs. {rental.securityDeposit.toLocaleString()} security deposit is
            protected until return verification.
          </p>
        </div>
      )}

      {rental.status === 'COMPLETED' && rental.rating && (
        <div className="flex items-center gap-2 border-t border-[#e3d8c0] bg-[#fbf7ef] px-5 py-3">
          <Star size={15} className="fill-[#b8862f] text-[#b8862f]" />

          <p className="text-[11px] text-[#5b6673]">
            You rated this rental{' '}
            <span className="font-bold text-[#17273f]">
              {rental.rating}.0 / 5
            </span>
          </p>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: RentalStatus }) {
  const config: Record<
    RentalStatus,
    {
      label: string;
      className: string;
    }
  > = {
    ACTIVE: {
      label: 'Active rental',
      className: 'bg-[#e4efe7] text-[#3f7a57]',
    },
    PENDING: {
      label: 'Awaiting approval',
      className: 'bg-[#fbebd6] text-[#c1791e]',
    },
    COMPLETED: {
      label: 'Completed',
      className: 'bg-[#f0e6d2] text-[#5b6673]',
    },
    RETURN_PENDING: {
      label: 'Return pending',
      className: 'bg-[#f3e4c4] text-[#8c6620]',
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bl-card p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3e4c4] text-[#b8862f]">
          {icon}
        </span>

        <span className="text-2xl font-bold text-[#17273f]">{value}</span>
      </div>

      <p className="mt-3 text-xs font-semibold text-[#5b6673]">{label}</p>
    </div>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[#fbf7ef] p-3">
      <div className="flex items-center gap-1.5 text-[#9aa3ae]">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-[0.06em]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xs font-bold text-[#17273f]">{value}</p>
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="bl-card px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0e6d2] text-[#b8862f]">
        <BookOpen size={25} />
      </div>

      <h2 className="mt-5 text-2xl">
        {searchQuery ? 'No matching rentals' : 'No rentals here yet'}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5b6673]">
        {searchQuery
          ? 'Try a different title, author or owner name.'
          : 'Explore the BookLoop catalogue and find something worth reading.'}
      </p>

      {!searchQuery && (
        <Link
          href="/explore"
          className="bl-button bl-button-primary mt-6"
        >
          Explore books
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}