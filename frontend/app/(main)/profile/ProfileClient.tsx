'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  ShieldCheck,
  User,
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

  useEffect(() => {
    const loadProfile = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace('/login');
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

        setProfile(user);

        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'bookloop_user',
            JSON.stringify(user),
          );
        }
      } catch (err) {
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
          router.replace('/login');
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

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
                    className="h-20 animate-pulse rounded-2xl bg-[var(--cream)]"
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

  return (
    <main className="min-h-screen bg-[var(--offwhite)] pb-24 md:pb-12">
      <div className="bl-container py-6 md:py-10">
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
            My profile
          </span>
        </div>

        <section className="bl-card overflow-hidden">
          <div className="relative h-32 bg-[var(--navy)] md:h-44">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/30" />
              <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full border border-white/20" />
            </div>
          </div>

          <div className="relative px-5 pb-7 md:px-8">
            <div className="-mt-11 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[var(--gold-soft)] text-2xl font-extrabold text-[var(--navy)] shadow-sm">
                  {initials}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl md:text-3xl">
                      {profile.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--green)]">
                      <CheckCircle2 size={12} />
                      Verified account
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    BookLoop member
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.alert(
                    'Profile editing will be connected when the backend provides a profile update endpoint.',
                  );
                }}
                className="bl-button bl-button-outline w-full sm:w-auto"
              >
                <Edit3 size={16} />
                Edit profile
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold)]">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-[var(--ink)]">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      Account role
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      {profile.role === 'ADMIN'
                        ? 'Administrator'
                        : 'BookLoop Member'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--navy)]">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      Member since
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--offwhite)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)] text-[var(--navy)]">
                    <BookOpen size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                      BookLoop activity
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                      View your rentals and listed books
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 text-[var(--gold)]"
                />

                <div>
                  <h2 className="text-lg">Your BookLoop account</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                    Your account is ready to borrow books and list
                    your own books for other readers. More profile
                    statistics will appear here as the corresponding
                    backend features are added.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-7 w-full rounded-xl border border-[var(--red)]/30 bg-[var(--red-soft)] px-4 py-3 text-sm font-bold text-[var(--red)] transition hover:bg-[var(--red-soft)]/70"
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}