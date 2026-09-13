'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  {
    label: 'Total users',
    value: '1,248',
    change: '+12.5%',
    positive: true,
    icon: Users,
  },
  {
    label: 'Listed books',
    value: '3,684',
    change: '+8.2%',
    positive: true,
    icon: BookOpen,
  },
  {
    label: 'Active rentals',
    value: '286',
    change: '+5.7%',
    positive: true,
    icon: TrendingUp,
  },
  {
    label: 'Rental revenue',
    value: 'Rs. 486K',
    change: '+14.3%',
    positive: true,
    icon: CircleDollarSign,
  },
];

const recentActivity = [
  {
    user: 'Amaya Fernando',
    action: 'listed a new book',
    item: 'Atomic Habits',
    time: '8 min ago',
    type: 'book',
  },
  {
    user: 'Kavindu Perera',
    action: 'completed a rental',
    item: 'The Alchemist',
    time: '24 min ago',
    type: 'rental',
  },
  {
    user: 'Nethmi Silva',
    action: 'reported a rental dispute',
    item: 'Deep Work',
    time: '42 min ago',
    type: 'dispute',
  },
  {
    user: 'Ravindu Jayasuriya',
    action: 'joined BookLoop',
    item: '',
    time: '1 hr ago',
    type: 'user',
  },
  {
    user: 'Shenali Perera',
    action: 'returned a book',
    item: 'Ikigai',
    time: '2 hrs ago',
    type: 'return',
  },
];

const disputes = [
  {
    id: '#DSP-1042',
    book: 'The Psychology of Money',
    reporter: 'Nethmi Silva',
    reason: 'Book returned damaged',
    status: 'UNDER REVIEW',
  },
  {
    id: '#DSP-1041',
    book: 'Clean Code',
    reporter: 'Ravindu Perera',
    reason: 'Security deposit dispute',
    status: 'OPEN',
  },
  {
    id: '#DSP-1039',
    book: 'Rich Dad Poor Dad',
    reporter: 'Amaya Fernando',
    reason: 'Book not returned',
    status: 'OPEN',
  },
];

const popularBooks = [
  { title: 'The Psychology of Money', rentals: 84, rating: '4.9' },
  { title: 'Atomic Habits', rentals: 72, rating: '4.8' },
  { title: 'The Alchemist', rentals: 65, rating: '4.7' },
  { title: 'Deep Work', rentals: 51, rating: '4.8' },
];

function statusClass(status: string) {
  if (status === 'OPEN') {
    return 'bg-[var(--red-soft)] text-[var(--red)]';
  }

  return 'bg-[var(--amber-soft)] text-[var(--amber)]';
}

function activityIcon(type: string) {
  if (type === 'dispute') return ShieldAlert;
  if (type === 'rental') return Clock3;
  if (type === 'return') return CheckCircle2;
  if (type === 'user') return UserCheck;
  return BookOpen;
}

export default function AdminClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--offwhite)]">
      {/* Mobile restricted view */}
      <div className="flex min-h-screen items-center justify-center px-6 lg:hidden">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--navy)] text-white">
            <ShieldAlert size={28} />
          </div>

          <h1 className="mt-6 text-3xl">Admin dashboard</h1>

          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            The BookLoop administration dashboard is designed for larger
            screens so important management tools remain easy to use.
          </p>

          <Link
            href="/"
            className="bl-button bl-button-primary mt-7 w-full"
          >
            Back to BookLoop
          </Link>
        </div>
      </div>

      {/* Desktop dashboard */}
      <div className="hidden min-h-screen lg:flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--border)] bg-[var(--navy)] text-white transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)] text-[var(--navy)]">
                  <BookOpen size={20} />
                </div>

                <div>
                  <p className="font-serif text-xl">BookLoop</p>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/40">
                    Administration
                  </p>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/50 hover:text-white lg:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-7">
              <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                Workspace
              </p>

              <div className="space-y-1">
                <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-left text-sm font-semibold text-white">
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <Users size={18} />
                  Users
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <BookOpen size={18} />
                  Books
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <BarChart3 size={18} />
                  Rentals
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <ShieldAlert size={18} />
                  Disputes
                  <span className="ml-auto rounded-full bg-[var(--red)] px-2 py-0.5 text-[10px] font-bold text-white">
                    3
                  </span>
                </button>
              </div>

              <p className="px-3 pb-3 pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                System
              </p>

              <div className="space-y-1">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white">
                  <Settings size={18} />
                  Settings
                </button>

                <Link
                  href="/"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={18} />
                  Exit admin
                </Link>
              </div>
            </nav>

            <div className="border-t border-white/10 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-sm font-bold text-[var(--navy)]">
                  AD
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">Admin User</p>
                  <p className="truncate text-xs text-white/40">
                    admin@bookloop.lk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--offwhite)]/95 px-8 backdrop-blur">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-[var(--ink-soft)] lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  Administration
                </p>
                <h1 className="mt-1 text-2xl">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden xl:block">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                />

                <input
                  placeholder="Search anything..."
                  className="w-64 rounded-xl border border-[var(--border)] bg-white py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[var(--navy)]"
                />
              </div>

              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--red)]" />
              </button>
            </div>
          </header>

          <div className="p-8">
            {/* Welcome */}
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-sm text-[var(--ink-soft)]">
                  Sunday, 13 September 2026
                </p>
                <h2 className="mt-1 text-3xl">Good evening, Admin.</h2>
              </div>

              <button className="bl-button bl-button-primary">
                <BarChart3 size={16} />
                Generate report
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="bl-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--navy)]">
                        <Icon size={19} />
                      </div>

                      <span className="flex items-center gap-1 text-xs font-bold text-[var(--green)]">
                        <ArrowUpRight size={13} />
                        {stat.change}
                      </span>
                    </div>

                    <p className="mt-6 text-2xl font-extrabold text-[var(--navy)]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Main analytics */}
            <div className="mt-6 grid grid-cols-[1.5fr_1fr] gap-6">
              {/* Rental overview */}
              <div className="bl-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl">Rental activity</h3>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      Rental transactions over the past 7 days
                    </p>
                  </div>

                  <button className="flex items-center gap-1 text-xs font-bold text-[var(--navy)]">
                    This week
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="mt-8 flex h-56 items-end gap-5 border-b border-[var(--border)] px-3">
                  {[48, 72, 55, 91, 68, 82, 96].map((height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        className="w-full max-w-10 rounded-t-lg bg-[var(--navy)] transition hover:bg-[var(--navy-2)]"
                        style={{ height: `${height}%` }}
                      />

                      <span className="mb-2 text-[10px] text-[var(--ink-muted)]">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-[var(--green)]">
                    <ArrowUpRight size={14} />
                    18.4%
                  </span>
                  <span className="text-[var(--ink-soft)]">
                    compared with last week
                  </span>
                </div>
              </div>

              {/* Popular books */}
              <div className="bl-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl">Popular books</h3>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      Most rented this month
                    </p>
                  </div>

                  <button className="text-[var(--ink-soft)]">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="mt-5 divide-y divide-[var(--border)]">
                  {popularBooks.map((book, index) => (
                    <div
                      key={book.title}
                      className="flex items-center gap-3 py-4"
                    >
                      <span className="w-5 text-xs font-bold text-[var(--ink-muted)]">
                        0{index + 1}
                      </span>

                      <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--navy)] text-white">
                        <BookOpen size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[var(--navy)]">
                          {book.title}
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--ink-soft)]">
                          {book.rentals} rentals · ★ {book.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-6 grid grid-cols-[1.3fr_1fr] gap-6">
              {/* Disputes */}
              <div className="bl-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl">Open disputes</h3>
                      <span className="rounded-full bg-[var(--red-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--red)]">
                        3 pending
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      Cases requiring administrator attention
                    </p>
                  </div>

                  <button className="text-xs font-bold text-[var(--navy)]">
                    View all
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px]">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left">
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                          Case
                        </th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                          Book
                        </th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {disputes.map((dispute) => (
                        <tr
                          key={dispute.id}
                          className="border-b border-[var(--border)] last:border-0"
                        >
                          <td className="px-6 py-4 text-xs font-bold text-[var(--navy)]">
                            {dispute.id}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-xs font-semibold">
                              {dispute.book}
                            </p>
                            <p className="mt-1 text-[10px] text-[var(--ink-muted)]">
                              {dispute.reporter}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-xs text-[var(--ink-soft)]">
                            {dispute.reason}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${statusClass(
                                dispute.status,
                              )}`}
                            >
                              {dispute.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity */}
              <div className="bl-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl">Recent activity</h3>
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">
                      Latest platform events
                    </p>
                  </div>

                  <button className="text-[var(--ink-soft)]">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  {recentActivity.map((activity) => {
                    const Icon = activityIcon(activity.type);

                    return (
                      <div
                        key={`${activity.user}-${activity.time}`}
                        className="flex gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--navy)]">
                          <Icon size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs leading-5">
                            <span className="font-bold text-[var(--navy)]">
                              {activity.user}
                            </span>{' '}
                            <span className="text-[var(--ink-soft)]">
                              {activity.action}
                            </span>
                            {activity.item && (
                              <>
                                {' '}
                                <span className="font-semibold">
                                  {activity.item}
                                </span>
                              </>
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-[var(--ink-muted)]">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* System status */}
            <div className="mt-6 grid grid-cols-3 gap-5">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--green-soft)] bg-[var(--green-soft)] p-4">
                <CheckCircle2
                  size={20}
                  className="text-[var(--green)]"
                />
                <div>
                  <p className="text-xs font-bold text-[var(--green)]">
                    API operational
                  </p>
                  <p className="text-[10px] text-[var(--green)]/70">
                    All services responding normally
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--amber-soft)] bg-[var(--amber-soft)] p-4">
                <AlertTriangle
                  size={20}
                  className="text-[var(--amber)]"
                />
                <div>
                  <p className="text-xs font-bold text-[var(--amber)]">
                    3 disputes
                  </p>
                  <p className="text-[10px] text-[var(--amber)]/70">
                    Require administrator review
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-4">
                <XCircle size={20} className="text-[var(--red)]" />
                <div>
                  <p className="text-xs font-bold text-[var(--red)]">
                    2 failed payments
                  </p>
                  <p className="text-[10px] text-[var(--red)]/70">
                    Recorded in the last 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}