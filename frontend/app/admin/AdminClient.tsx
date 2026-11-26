
'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  CreditCard,
  AlertCircle,
  Star,
  Search,
  Menu,
  X,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  LogOut,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { logout } from '@/lib/auth';

// ==================================================
// TYPES
// ==================================================

type AdminStats = {
  totalUsers: number;
  totalBooks: number;
  totalRentals: number;
  activeRentals: number;
  totalPayments: number;
  openDisputes: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    booksOwned: number;
    rentals: number;
    rentalsAsOwner: number;
    reviewsGiven: number;
    reviewsReceived: number;
  };
};

type AdminBook = {
  id: string;
  title: string;
  author: string;
  status: string;
  dailyRate: string | number;
  securityDeposit: string | number;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    rentals: number;
    reviews: number;
  };
};

type AdminRental = {
  id: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  rentalAmount: string | number;
  securityDeposit: string | number;
  createdAt: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  renter: {
    id: string;
    name: string;
    email: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    payments: number;
    disputes: number;
    reviews: number;
  };
};

type AdminPayment = {
  id: string;
  type: string;
  amount: string | number;
  currency: string;
  status: string;
  provider: string | null;
  providerPaymentId: string | null;
  createdAt: string;
  rental: {
    id: string;
    status: string;
    book: {
      id: string;
      title: string;
    };
    renter: {
      id: string;
      name: string;
      email: string;
    };
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
};

type Dispute = {
  id: string;
  reason: string;
  description: string;
  status: string;
  resolution?: string | null;
  createdAt: string;
  raisedBy: {
    id: string;
    name: string;
    email: string;
  };
  rental: {
    id: string;
    status: string;
    book: {
      id: string;
      title: string;
    };
    renter: {
      id: string;
      name: string;
    };
    owner: {
      id: string;
      name: string;
    };
  };
};

type AdminReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
  reviewee: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
  };
  rental: {
    id: string;
    status: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// ==================================================
// NAVIGATION
// ==================================================

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Users', icon: Users },
  { name: 'Books', icon: BookOpen },
  { name: 'Rentals', icon: CalendarDays },
  { name: 'Payments', icon: CreditCard },
  { name: 'Disputes', icon: AlertCircle },
  { name: 'Reviews', icon: Star },
];

const pageDescription: Record<string, string> = {
  Overview: 'Monitor your BookLoop platform at a glance.',
  Users: 'View registered BookLoop accounts.',
  Books: 'Monitor and manage books listed on the platform.',
  Rentals: 'Review and monitor rental transactions.',
  Payments: 'View platform payment records.',
  Disputes: 'Review and resolve user disputes.',
  Reviews: 'Monitor reviews and feedback.',
};

const money = (amount: string | number, currency = 'LKR') =>
  `${currency} ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB');

const formatStatus = (status: string) =>
  status.replaceAll('_', ' ');

function StatusBadge({ status }: { status: string }) {
  const normalised = status.toUpperCase();

  const colour =
    ['AVAILABLE', 'COMPLETED', 'PAID', 'RESOLVED', 'CONFIRMED'].includes(
      normalised
    )
      ? 'bg-green-100 text-green-700'
      : ['REJECTED', 'CANCELLED', 'FAILED', 'LOST', 'UNAVAILABLE'].includes(
            normalised
          )
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colour}`}
    >
      {formatStatus(status)}
    </span>
  );
}

// ==================================================
// COMPONENT
// ==================================================

export default function AdminClient() {
  const router = useRouter();

  const [activePage, setActivePage] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  const [updatingId, setUpdatingId] = useState('');
  const [resolution, setResolution] = useState('');
  const [selectedDispute, setSelectedDispute] =
    useState<Dispute | null>(null);

  // ------------------------------------------------
  // LOAD ALL ADMIN DATA
  // ------------------------------------------------

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [
        statsResult,
        usersResult,
        booksResult,
        rentalsResult,
        paymentsResult,
        disputesResult,
        reviewsResult,
      ] = await Promise.all([
        apiRequest<ApiResponse<AdminStats>>('/admin/stats', {
          auth: true,
        }),

        apiRequest<ApiResponse<{ users: AdminUser[]; count: number }>>(
          '/admin/users',
          { auth: true }
        ),

        apiRequest<ApiResponse<{ books: AdminBook[]; count: number }>>(
          '/admin/books',
          { auth: true }
        ),

        apiRequest<ApiResponse<{ rentals: AdminRental[]; count: number }>>(
          '/admin/rentals',
          { auth: true }
        ),

        apiRequest<ApiResponse<{ payments: AdminPayment[]; count: number }>>(
          '/admin/payments',
          { auth: true }
        ),

        apiRequest<ApiResponse<{ disputes: Dispute[]; count: number }>>(
          '/admin/disputes',
          { auth: true }
        ),

        apiRequest<ApiResponse<{ reviews: AdminReview[]; count: number }>>(
          '/admin/reviews',
          { auth: true }
        ),
      ]);

      setStats(statsResult.data);
      setUsers(usersResult.data.users || []);
      setBooks(booksResult.data.books || []);
      setRentals(rentalsResult.data.rentals || []);
      setPayments(paymentsResult.data.payments || []);
      setDisputes(disputesResult.data.disputes || []);
      setReviews(reviewsResult.data.reviews || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load admin dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      router.replace('/');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  // ------------------------------------------------
  // SEARCH
  // ------------------------------------------------

  const matchesSearch = (...values: (string | null | undefined)[]) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return values.some((value) =>
      String(value ?? '').toLowerCase().includes(query)
    );
  };

  // ------------------------------------------------
  // UPDATE BOOK AVAILABILITY
  // ------------------------------------------------

  const updateBookStatus = async (book: AdminBook) => {
    const newStatus =
      book.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

    if (
      !window.confirm(
        `Change "${book.title}" to ${formatStatus(newStatus)}?`
      )
    ) {
      return;
    }

    setUpdatingId(book.id);
    setError('');

    try {
      await apiRequest(`/admin/books/${book.id}/status`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ status: newStatus }),
      });

      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update book.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  // ------------------------------------------------
  // UPDATE DISPUTE
  // ------------------------------------------------

  const updateDispute = async (
    id: string,
    status: 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
  ) => {
    if (status === 'RESOLVED' && resolution.trim().length < 5) {
      setError('Please enter a resolution of at least 5 characters.');
      return;
    }

    if (
      (status === 'RESOLVED' || status === 'REJECTED') &&
      !window.confirm(
        `Are you sure you want to ${status.toLowerCase()} this dispute?`
      )
    ) {
      return;
    }

    setUpdatingId(id);
    setError('');

    try {
      await apiRequest(`/admin/disputes/${id}`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({
          status,
          ...(status === 'RESOLVED' || status === 'REJECTED'
            ? { resolution: resolution.trim() }
            : {}),
        }),
      });

      setSelectedDispute(null);
      setResolution('');
      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update dispute.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  // ------------------------------------------------
  // DELETE REVIEW
  // ------------------------------------------------

  const deleteReview = async (review: AdminReview) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this review by ${review.reviewer.name}?`
      )
    ) {
      return;
    }

    setUpdatingId(review.id);
    setError('');

    try {
      await apiRequest(`/admin/reviews/${review.id}`, {
        method: 'DELETE',
        auth: true,
      });

      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete review.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  // ------------------------------------------------
  // STATISTICS CARDS
  // ------------------------------------------------

  const statsCards = [
    {
      title: 'Total users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      colour: 'bg-blue-50 text-blue-700',
      description: 'Registered accounts',
    },
    {
      title: 'Listed books',
      value: stats?.totalBooks ?? 0,
      icon: BookOpen,
      colour: 'bg-amber-50 text-amber-700',
      description: 'Books on the platform',
    },
    {
      title: 'Total rentals',
      value: stats?.totalRentals ?? 0,
      icon: CalendarDays,
      colour: 'bg-purple-50 text-purple-700',
      description: 'All rental records',
    },
    {
      title: 'Active rentals',
      value: stats?.activeRentals ?? 0,
      icon: TrendingUp,
      colour: 'bg-green-50 text-green-700',
      description: 'Currently in progress',
    },
    {
      title: 'Payments',
      value: stats?.totalPayments ?? 0,
      icon: CreditCard,
      colour: 'bg-pink-50 text-pink-700',
      description: 'Payment records',
    },
    {
      title: 'Open disputes',
      value: stats?.openDisputes ?? 0,
      icon: AlertCircle,
      colour: 'bg-red-50 text-red-700',
      description: 'Require attention',
    },
  ];

  // ==================================================
  // PAGE CONTENT
  // ==================================================

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#17273F]">
      <div className="flex min-h-screen">
        {mobileMenuOpen && (
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E9E4D9] bg-white transition-transform lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-[#EEEAE1] px-7">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-7 w-7 text-[#B8862F]" />
                <span className="font-serif text-2xl font-bold">
                  BookLoop
                </span>
              </div>

              <p className="mt-1 pl-9 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Administration
              </p>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 py-7">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActivePage(item.name);
                      setSearch('');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? 'bg-[#17273F] text-white shadow-md'
                        : 'text-gray-600 hover:bg-[#F7F4ED] hover:text-[#17273F]'
                    }`}
                  >
                    <Icon size={19} />
                    {item.name}

                    {item.name === 'Disputes' &&
                      (stats?.openDisputes ?? 0) > 0 && (
                        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                          {stats?.openDisputes}
                        </span>
                      )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-[#EEEAE1] p-5">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F8F7F3] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17273F] text-white">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">Administrator</p>
                <p className="text-xs text-gray-500">BookLoop Admin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-[#F7F4ED]"
            >
              <ArrowUpRight size={18} />
              Return to website
            </button>
          </div>
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E9E4D9] bg-white/95 px-5 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div>
                <h1 className="font-serif text-xl font-bold md:text-2xl">
                  Admin Dashboard
                </h1>

                <p className="hidden text-xs text-gray-500 sm:block">
                  BookLoop management workspace
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}

            <div className="flex items-center gap-2">
              <button
                onClick={loadDashboard}
                disabled={loading || loggingOut}
                className="flex items-center gap-2 rounded-xl border border-[#E9E4D9] px-3 py-2 text-sm font-medium hover:bg-[#F8F7F3] disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={16} />
                <span>
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-[#B8862F]">
                BOOKLOOP MANAGEMENT
              </p>

              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                {activePage}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {pageDescription[activePage]}
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex min-h-64 items-center justify-center">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-[#B8862F]"
                />
              </div>
            ) : (
              <>
                {/* OVERVIEW */}

                {activePage === 'Overview' && (
                  <>
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {statsCards.map((card) => {
                        const Icon = card.icon;

                        return (
                          <div
                            key={card.title}
                            className="rounded-2xl border border-[#EAE5DB] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.colour}`}
                              >
                                <Icon size={21} />
                              </div>

                              <ArrowUpRight
                                size={18}
                                className="text-gray-300"
                              />
                            </div>

                            <p className="mt-5 text-sm text-gray-500">
                              {card.title}
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                              {card.value.toLocaleString()}
                            </p>

                            <p className="mt-2 text-xs text-gray-400">
                              {card.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-3">
                      <section className="rounded-2xl border border-[#EAE5DB] bg-white p-6 xl:col-span-2">
                        <h3 className="font-serif text-xl font-bold">
                          Platform overview
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Current platform activity
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl bg-[#F8F7F3] p-5">
                            <p className="text-sm text-gray-500">
                              Registered members
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                              {stats?.totalUsers ?? 0}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#F8F7F3] p-5">
                            <p className="text-sm text-gray-500">
                              Current active rentals
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                              {stats?.activeRentals ?? 0}
                            </p>
                          </div>
                        </div>
                      </section>

                      <section className="rounded-2xl border border-[#EAE5DB] bg-white p-6">
                        <div className="mb-5 flex items-center gap-2">
                          <AlertCircle
                            size={20}
                            className="text-red-500"
                          />

                          <h3 className="font-serif text-xl font-bold">
                            Attention needed
                          </h3>
                        </div>

                        <div className="rounded-xl bg-red-50 p-4">
                          <p className="text-sm text-red-700">
                            Open disputes
                          </p>

                          <p className="mt-1 text-3xl font-bold text-red-800">
                            {stats?.openDisputes ?? 0}
                          </p>

                          <button
                            onClick={() => setActivePage('Disputes')}
                            className="mt-4 text-sm font-semibold text-red-700 underline underline-offset-4"
                          >
                            Review disputes
                          </button>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                {/* USERS */}

                {activePage === 'Users' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white">
                    <SectionHeader
                      title="Users management"
                      description={`${users.length} registered accounts`}
                      search={search}
                      setSearch={setSearch}
                    />

                    {users.filter((user) =>
                      matchesSearch(user.name, user.email, user.role)
                    ).length === 0 ? (
                      <EmptyState message="No users found." />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                          <thead className="bg-[#F8F7F3] text-xs uppercase text-gray-500">
                            <tr>
                              <th className="p-4">User</th>
                              <th className="p-4">Role</th>
                              <th className="p-4">Books</th>
                              <th className="p-4">Rentals</th>
                              <th className="p-4">Joined</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-[#EEEAE1]">
                            {users
                              .filter((user) =>
                                matchesSearch(
                                  user.name,
                                  user.email,
                                  user.role
                                )
                              )
                              .map((user) => (
                                <tr
                                  key={user.id}
                                  className="hover:bg-[#FBFAF7]"
                                >
                                  <td className="p-4">
                                    <p className="font-semibold">
                                      {user.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      {user.email}
                                    </p>
                                  </td>

                                  <td className="p-4">
                                    <StatusBadge status={user.role} />
                                  </td>

                                  <td className="p-4">
                                    {user._count.booksOwned}
                                  </td>

                                  <td className="p-4">
                                    {user._count.rentals +
                                      user._count.rentalsAsOwner}
                                  </td>

                                  <td className="p-4 text-gray-500">
                                    {formatDate(user.createdAt)}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                )}

                {/* BOOKS */}

                {activePage === 'Books' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white">
                    <SectionHeader
                      title="Books management"
                      description={`${books.length} books listed`}
                      search={search}
                      setSearch={setSearch}
                    />

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-[#F8F7F3] text-xs uppercase text-gray-500">
                          <tr>
                            <th className="p-4">Book</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Daily rate</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Rentals</th>
                            <th className="p-4">Action</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEEAE1]">
                          {books
                            .filter((book) =>
                              matchesSearch(
                                book.title,
                                book.author,
                                book.owner.name,
                                book.owner.email
                              )
                            )
                            .map((book) => (
                              <tr
                                key={book.id}
                                className="hover:bg-[#FBFAF7]"
                              >
                                <td className="p-4">
                                  <p className="font-semibold">
                                    {book.title}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {book.author}
                                  </p>
                                </td>

                                <td className="p-4">
                                  <p>{book.owner.name}</p>

                                  <p className="text-xs text-gray-500">
                                    {book.owner.email}
                                  </p>
                                </td>

                                <td className="p-4">
                                  {money(book.dailyRate)}
                                </td>

                                <td className="p-4">
                                  <StatusBadge status={book.status} />
                                </td>

                                <td className="p-4">
                                  {book._count.rentals}
                                </td>

                                <td className="p-4">
                                  <button
                                    disabled={!!updatingId}
                                    onClick={() =>
                                      updateBookStatus(book)
                                    }
                                    className="rounded-lg border border-[#E9E4D9] px-3 py-2 text-xs font-semibold hover:bg-[#F8F7F3] disabled:opacity-50"
                                  >
                                    {updatingId === book.id
                                      ? 'Updating...'
                                      : book.status === 'AVAILABLE'
                                        ? 'Make unavailable'
                                        : 'Make available'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {books.length === 0 && (
                      <EmptyState message="No books have been listed yet." />
                    )}
                  </section>
                )}

                {/* RENTALS */}

                {activePage === 'Rentals' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white">
                    <SectionHeader
                      title="Rental management"
                      description={`${rentals.length} rental records`}
                      search={search}
                      setSearch={setSearch}
                    />

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-[#F8F7F3] text-xs uppercase text-gray-500">
                          <tr>
                            <th className="p-4">Book</th>
                            <th className="p-4">Renter</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Period</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEEAE1]">
                          {rentals
                            .filter((rental) =>
                              matchesSearch(
                                rental.book.title,
                                rental.renter.name,
                                rental.renter.email,
                                rental.owner.name,
                                rental.status
                              )
                            )
                            .map((rental) => (
                              <tr
                                key={rental.id}
                                className="hover:bg-[#FBFAF7]"
                              >
                                <td className="p-4 font-semibold">
                                  {rental.book.title}
                                </td>

                                <td className="p-4">
                                  {rental.renter.name}
                                </td>

                                <td className="p-4">
                                  {rental.owner.name}
                                </td>

                                <td className="p-4 text-gray-500">
                                  {formatDate(rental.startDate)} –{' '}
                                  {formatDate(rental.endDate)}
                                </td>

                                <td className="p-4">
                                  {money(rental.rentalAmount)}
                                </td>

                                <td className="p-4">
                                  <StatusBadge status={rental.status} />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rentals.length === 0 && (
                      <EmptyState message="No rental records found." />
                    )}
                  </section>
                )}

                {/* PAYMENTS */}

                {activePage === 'Payments' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white">
                    <SectionHeader
                      title="Payment management"
                      description={`${payments.length} payment records`}
                      search={search}
                      setSearch={setSearch}
                    />

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-[#F8F7F3] text-xs uppercase text-gray-500">
                          <tr>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Book</th>
                            <th className="p-4">Renter</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEEAE1]">
                          {payments
                            .filter((payment) =>
                              matchesSearch(
                                payment.id,
                                payment.providerPaymentId,
                                payment.rental.book.title,
                                payment.rental.renter.name,
                                payment.type,
                                payment.status
                              )
                            )
                            .map((payment) => (
                              <tr
                                key={payment.id}
                                className="hover:bg-[#FBFAF7]"
                              >
                                <td className="p-4 font-mono text-xs">
                                  {payment.id.slice(0, 8)}
                                </td>

                                <td className="p-4">
                                  {payment.rental.book.title}
                                </td>

                                <td className="p-4">
                                  {payment.rental.renter.name}
                                </td>

                                <td className="p-4 font-semibold">
                                  {money(
                                    payment.amount,
                                    payment.currency
                                  )}
                                </td>

                                <td className="p-4">
                                  {formatStatus(payment.type)}
                                </td>

                                <td className="p-4">
                                  <StatusBadge status={payment.status} />
                                </td>

                                <td className="p-4 text-gray-500">
                                  {formatDate(payment.createdAt)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {payments.length === 0 && (
                      <EmptyState message="No payment records found." />
                    )}
                  </section>
                )}

                {/* DISPUTES */}

                {activePage === 'Disputes' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white shadow-sm">
                    <SectionHeader
                      title="Dispute management"
                      description={`${disputes.length} dispute records`}
                      search={search}
                      setSearch={setSearch}
                    />

                    {disputes.filter((dispute) =>
                      matchesSearch(
                        dispute.reason,
                        dispute.raisedBy.name,
                        dispute.rental.book.title,
                        dispute.status
                      )
                    ).length === 0 ? (
                      <EmptyState message="No matching disputes found." />
                    ) : (
                      <div className="divide-y divide-[#EEEAE1]">
                        {disputes
                          .filter((dispute) =>
                            matchesSearch(
                              dispute.reason,
                              dispute.raisedBy.name,
                              dispute.rental.book.title,
                              dispute.status
                            )
                          )
                          .map((dispute) => (
                            <button
                              key={dispute.id}
                              onClick={() =>
                                setSelectedDispute(dispute)
                              }
                              className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-[#FBFAF7] sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold">
                                    {dispute.reason}
                                  </span>

                                  <StatusBadge
                                    status={dispute.status}
                                  />
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                  {dispute.rental.book.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Raised by {dispute.raisedBy.name}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                {formatDate(dispute.createdAt)}
                                <ArrowUpRight size={17} />
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </section>
                )}

                {/* REVIEWS */}

                {activePage === 'Reviews' && (
                  <section className="overflow-hidden rounded-2xl border border-[#EAE5DB] bg-white">
                    <SectionHeader
                      title="Review management"
                      description={`${reviews.length} reviews`}
                      search={search}
                      setSearch={setSearch}
                    />

                    {reviews.filter((review) =>
                      matchesSearch(
                        review.comment,
                        review.reviewer.name,
                        review.reviewee.name,
                        review.book.title
                      )
                    ).length === 0 ? (
                      <EmptyState message="No reviews found." />
                    ) : (
                      <div className="divide-y divide-[#EEEAE1]">
                        {reviews
                          .filter((review) =>
                            matchesSearch(
                              review.comment,
                              review.reviewer.name,
                              review.reviewee.name,
                              review.book.title
                            )
                          )
                          .map((review) => (
                            <div
                              key={review.id}
                              className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {review.reviewer.name}
                                  </span>

                                  <span className="flex items-center gap-1 text-amber-600">
                                    <Star
                                      size={15}
                                      fill="currentColor"
                                    />
                                    {review.rating}/5
                                  </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                  Reviewed {review.reviewee.name} ·{' '}
                                  {review.book.title}
                                </p>

                                <p className="mt-3 text-sm leading-6 text-gray-700">
                                  {review.comment ||
                                    'No written comment.'}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                  {formatDate(review.createdAt)}
                                </p>
                              </div>

                              <button
                                disabled={!!updatingId}
                                onClick={() => deleteReview(review)}
                                className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                {updatingId === review.id
                                  ? 'Deleting...'
                                  : 'Delete review'}
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* DISPUTE DETAILS MODAL */}

      {selectedDispute && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B8862F]">
                  Dispute details
                </p>

                <h3 className="mt-2 font-serif text-2xl font-bold">
                  {selectedDispute.reason}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDispute(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Description</p>

                <p className="mt-1 leading-6">
                  {selectedDispute.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-gray-400">Reported by</p>

                  <p className="mt-1 font-medium">
                    {selectedDispute.raisedBy.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Book</p>

                  <p className="mt-1 font-medium">
                    {selectedDispute.rental.book.title}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Renter</p>

                  <p className="mt-1 font-medium">
                    {selectedDispute.rental.renter.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Owner</p>

                  <p className="mt-1 font-medium">
                    {selectedDispute.rental.owner.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-400">Current status</p>
                <StatusBadge status={selectedDispute.status} />
              </div>

              {selectedDispute.status !== 'RESOLVED' &&
                selectedDispute.status !== 'REJECTED' && (
                  <>
                    <div>
                      <label className="mb-2 block font-medium">
                        Resolution notes
                      </label>

                      <textarea
                        value={resolution}
                        onChange={(event) =>
                          setResolution(event.target.value)
                        }
                        rows={3}
                        placeholder="Explain the decision (at least 5 characters)..."
                        className="w-full rounded-xl border border-[#E9E4D9] p-3 outline-none focus:border-[#B8862F]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={!!updatingId}
                        onClick={() =>
                          updateDispute(
                            selectedDispute.id,
                            'UNDER_REVIEW'
                          )
                        }
                        className="rounded-xl border border-[#E9E4D9] px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                      >
                        Mark under review
                      </button>

                      <button
                        disabled={!!updatingId}
                        onClick={() =>
                          updateDispute(
                            selectedDispute.id,
                            'RESOLVED'
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        Resolve
                      </button>

                      <button
                        disabled={!!updatingId}
                        onClick={() =>
                          updateDispute(
                            selectedDispute.id,
                            'REJECTED'
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================================================
// REUSABLE SECTION HEADER
// ==================================================

function SectionHeader({
  title,
  description,
  search,
  setSearch,
}: {
  title: string;
  description: string;
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#EEEAE1] p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-serif text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="relative w-full md:w-72">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search records..."
          className="w-full rounded-xl border border-[#E9E4D9] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#B8862F]"
        />
      </div>
    </div>
  );
}

// ==================================================
// EMPTY STATE
// ==================================================

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 text-center">
      <Eye size={34} className="mx-auto text-gray-300" />

      <h4 className="mt-4 font-semibold">No records found</h4>

      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}
