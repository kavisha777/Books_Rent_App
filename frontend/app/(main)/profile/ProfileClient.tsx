
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  Bell,
  Library,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  PlusCircle,
  ClipboardList,
} from 'lucide-react';

import { apiRequest } from '../../../lib/api';
import { clearAuth, getAccessToken } from '../../../lib/auth';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
};

type ProfileResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: UserProfile;
  };
};

function formatDate(value?: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function ProfileClient() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace('/auth/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<ProfileResponse>(
          '/users/me',
          {
            method: 'GET',
            auth: true,
          },
        );

        const user = response.data?.user;

        if (!user) {
          throw new Error('Profile information was not returned.');
        }

        if (cancelled) return;

        setProfile(user);

        localStorage.setItem(
          'bookloop_user',
          JSON.stringify(user),
        );
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load your profile.';

        if (
          message.toLowerCase().includes('authentication') ||
          message.toLowerCase().includes('unauthorised') ||
          message.toLowerCase().includes('unauthorized')
        ) {
          clearAuth();
          router.replace('/auth/login');
          return;
        }

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    clearAuth();

    localStorage.removeItem('bookloop_user');

    router.replace('/auth/login');
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)] pb-24">
        <div className="bl-container py-8">
          <div className="mb-8 h-8 w-40 animate-pulse rounded bg-[var(--cream)]" />

          <div className="bl-card overflow-hidden">
            <div className="h-40 animate-pulse bg-[var(--navy)]/10" />

            <div className="p-6">
              <div className="h-20 w-20 -mt-16 animate-pulse rounded-full bg-[var(--cream)]" />

              <div className="mt-5 h-7 w-48 animate-pulse rounded bg-[var(--cream)]" />

              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-[var(--cream)]" />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-[var(--cream)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[var(--offwhite)] pb-24">
        <div className="bl-container flex min-h-[70vh] items-center justify-center">
          <div className="bl-card w-full max-w-lg p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--red-soft)] text-[var(--red)]">
              <User size={25} />
            </div>

            <h1 className="mt-5 text-2xl">
              Profile unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              {error || 'We could not retrieve your profile.'}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bl-button bl-button-primary mt-6"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 block w-full text-sm font-semibold text-[var(--red)]"
            >
              Log out
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'BL';

  const actions = [
    {
      title: 'My Rentals',
      description: 'View the books you have borrowed and their rental status.',
      href: '/rentals',
      icon: BookOpen,
    },
    {
      title: 'Rental Requests',
      description: 'Manage requests related to your rental activity.',
      href: '/rentals',
      icon: ClipboardList,
    },
    {
      title: 'List a Book',
      description: 'Add a book to BookLoop and share it with other readers.',
      href: '/list-book',
      icon: PlusCircle,
    },
    {
      title: 'Explore Books',
      description: 'Discover books available from other readers.',
      href: '/explore',
      icon: Compass,
    },
    {
      title: 'Notifications',
      description: 'Check updates and important account notifications.',
      href: '/notifications',
      icon: Bell,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--offwhite)] pb-28 md:pb-12">
      <div className="bl-container py-6 md:py-10">

        {/* PAGE HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--navy)]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
            My Account
          </span>
        </div>

        {/* PROFILE CARD */}
        <section className="bl-card overflow-hidden">

          {/* COVER */}
          <div className="relative h-32 overflow-hidden bg-[var(--navy)] md:h-44">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/30" />
              <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full border border-white/20" />
            </div>

            <div className="absolute bottom-5 left-7 text-white/80">
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                BookLoop
              </p>
              <p className="mt-1 font-serif text-lg">
                Your reading community
              </p>
            </div>
          </div>

          <div className="relative px-5 pb-7 md:px-8">

            {/* USER INFORMATION */}
            <div className="-mt-11 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[var(--gold-soft)] text-2xl font-extrabold text-[var(--navy)] shadow-sm">
                  {initials}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-[var(--ink)] md:text-3xl">
                      {profile.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--green)]">
                      <CheckCircle2 size={12} />
                      Account active
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    BookLoop Member
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--red)]/30 bg-[var(--red-soft)] px-5 py-3 text-sm font-bold text-[var(--red)] transition hover:opacity-80 disabled:opacity-50 sm:w-auto"
              >
                <LogOut size={17} />
                {loggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </div>

            {/* ACCOUNT INFORMATION */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-[var(--ink)]">
                Account Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {/* EMAIL */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold)]">
                      <Mail size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                        Email Address
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ROLE */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]">
                      <ShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                        Account Role
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                        {profile.role === 'ADMIN'
                          ? 'Administrator'
                          : 'BookLoop Member'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MEMBER SINCE */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--navy)]">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                        Member Since
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACCOUNT STATUS */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--navy)]">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--green)]">
                        Active
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* BOOKLOOP ACTIVITIES */}
            <div className="mt-10">
              <div>
                <h2 className="text-xl font-bold text-[var(--ink)]">
                  My BookLoop
                </h2>

                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  Manage your borrowing and lending activities from one place.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--gold)] hover:shadow-md"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--navy)] transition group-hover:bg-[var(--navy)] group-hover:text-white">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[var(--ink)]">
                          {action.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                          {action.description}
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-[var(--ink-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                      />
                    </Link>
                  );
                })}

              </div>
            </div>

            {/* ACCOUNT NOTE */}
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-start gap-3">
                <BookOpen
                  size={21}
                  className="mt-0.5 shrink-0 text-[var(--gold)]"
                />

                <div>
                  <h2 className="font-bold text-[var(--ink)]">
                    One account. Two ways to enjoy BookLoop.
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                    You can borrow books from other readers and list your
                    own books for others to borrow using the same account.
                    You do not need separate accounts for borrowing and
                    lending.
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
