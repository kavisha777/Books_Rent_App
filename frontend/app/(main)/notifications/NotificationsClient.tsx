'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  CircleAlert,
  Clock3,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  Star,
  UserCheck,
  X,
} from 'lucide-react';

import { apiRequest } from '../../../lib/api';

type NotificationType =
  | 'RENTAL_REQUEST'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'PAYMENT'
  | 'HANDOVER'
  | 'RETURN'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'LOST'
  | 'DISPUTE'
  | 'REVIEW';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string | null;
  rentalId: string | null;
  read: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  data?: {
    notifications?: NotificationItem[];
    unreadCount?: number;
  };
  notifications?: NotificationItem[];
};

function extractNotifications(
  response: NotificationsResponse,
): NotificationItem[] {
  if (Array.isArray(response.data?.notifications)) {
    return response.data.notifications;
  }

  if (Array.isArray(response.notifications)) {
    return response.notifications;
  }

  return [];
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();

  if (Number.isNaN(then)) {
    return '—';
  }

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

const typeMeta: Record<
  NotificationType,
  {
    icon: typeof Bell;
    label: string;
    action?: string;
    className: string;
  }
> = {
  RENTAL_REQUEST: {
    icon: UserCheck,
    label: 'Rental request',
    action: 'Review request',
    className: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
  APPROVED: {
    icon: Check,
    label: 'Approved',
    action: 'Pay now',
    className: 'bg-[var(--green-soft)] text-[var(--green)]',
  },
  REJECTED: {
    icon: X,
    label: 'Rejected',
    className: 'bg-[var(--red-soft)] text-[var(--red)]',
  },
  CANCELLED: {
    icon: CircleAlert,
    label: 'Cancelled',
    className: 'bg-[var(--cream)] text-[var(--navy-3)]',
  },
  PAYMENT: {
    icon: CreditCard,
    label: 'Payment',
    action: 'Arrange handover',
    className: 'bg-[var(--cream)] text-[var(--navy-3)]',
  },
  HANDOVER: {
    icon: BookOpen,
    label: 'Handover',
    action: 'View rental',
    className: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
  RETURN: {
    icon: RotateCcw,
    label: 'Return',
    action: 'Inspect book',
    className: 'bg-[var(--amber-soft)] text-[var(--amber)]',
  },
  COMPLETED: {
    icon: CheckCheck,
    label: 'Completed',
    action: 'Leave a review',
    className: 'bg-[var(--green-soft)] text-[var(--green)]',
  },
  OVERDUE: {
    icon: Clock3,
    label: 'Overdue',
    action: 'View rental',
    className: 'bg-[var(--amber-soft)] text-[var(--amber)]',
  },
  LOST: {
    icon: ShieldAlert,
    label: 'Lost',
    action: 'View details',
    className: 'bg-[var(--red-soft)] text-[var(--red)]',
  },
  DISPUTE: {
    icon: ShieldAlert,
    label: 'Dispute',
    action: 'View details',
    className: 'bg-[var(--red-soft)] text-[var(--red)]',
  },
  REVIEW: {
    icon: Star,
    label: 'Review',
    className: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
};

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    return apiRequest<NotificationsResponse>('/notifications', { auth: true })
      .then((response) => {
        setNotifications(extractNotifications(response));
        setError(null);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load your notifications.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  async function markAsRead(id: string) {
    // Optimistic: the badge clears on click rather than after the round trip.
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );

    try {
      await apiRequest(`/notifications/${id}/read`, {
        method: 'PATCH',
        auth: true,
      });
    } catch {
      void load();
    }
  }

  async function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );

    try {
      await apiRequest('/notifications/read-all', {
        method: 'PATCH',
        auth: true,
      });
    } catch {
      void load();
    }
  }

  function removeNotification(id: string) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="bl-container flex min-h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--navy)] transition hover:bg-[var(--offwhite)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl">Notifications</h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-[var(--navy)] px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="mt-1 hidden text-sm text-[var(--ink-soft)] sm:block">
                Stay updated on your BookLoop activity.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[var(--navy)] transition hover:bg-[var(--offwhite)] sm:flex"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bl-container py-6 sm:py-8">
        {/* Desktop intro */}
        <div className="mb-6 hidden items-end justify-between md:flex">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
              Your activity
            </p>
            <h2 className="mt-1 text-3xl">Recent updates</h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)]">
            <Bell className="h-4 w-4" />
            {notifications.length} notifications
          </div>
        </div>

        {error && (
          <section className="bl-card mx-auto mb-6 max-w-xl p-5 text-center">
            <p className="text-sm font-semibold text-[var(--red)]">{error}</p>

            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 text-xs font-bold text-[var(--navy)] hover:underline"
            >
              Try again
            </button>
          </section>
        )}

        {loading ? (
          <section className="bl-card mx-auto max-w-xl p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream)]">
              <Clock3 className="h-7 w-7 animate-pulse text-[var(--navy-3)]" />
            </div>

            <p className="mt-5 text-sm text-[var(--ink-soft)]">
              Loading your notifications...
            </p>
          </section>
        ) : notifications.length === 0 ? (
          <section className="bl-card mx-auto max-w-xl p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream)]">
              <Bell className="h-7 w-7 text-[var(--navy-3)]" />
            </div>

            <h2 className="mt-5 text-3xl">You&apos;re all caught up</h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--ink-soft)]">
              There are no notifications to show right now. New rental
              activity will appear here.
            </p>

            <Link
              href="/explore"
              className="bl-button bl-button-primary mt-6"
            >
              Explore Books
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Notification feed */}
            <section className="space-y-3">
              {notifications.map((notification) => {
                const meta = typeMeta[notification.type];
                const Icon = meta.icon;

                return (
                  <article
                    key={notification.id}
                    className={`bl-card relative overflow-hidden p-4 transition sm:p-5 ${
                      !notification.read
                        ? 'border-[var(--cream-2)] bg-white'
                        : 'bg-white'
                    }`}
                  >
                    {!notification.read && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-[var(--gold)]" />
                    )}

                    <div className="flex gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-sans text-sm font-bold text-[var(--navy)]">
                                {notification.title}
                              </h3>

                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
                              )}
                            </div>

                            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                              {notification.message}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeNotification(notification.id)}
                            aria-label={`Remove ${notification.title}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-muted)] transition hover:bg-[var(--offwhite)] hover:text-[var(--navy)]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
                            <Clock3 className="h-3.5 w-3.5" />
                            {timeAgo(notification.createdAt)}
                          </span>

                          <span className="text-[11px] font-semibold text-[var(--ink-muted)]">
                            {meta.label}
                          </span>

                          <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
                            {!notification.read && (
                              <button
                                type="button"
                                onClick={() => void markAsRead(notification.id)}
                                className="text-[11px] font-bold text-[var(--navy-3)] hover:underline"
                              >
                                Mark as read
                              </button>
                            )}

                            {meta.action && notification.href && (
                              <Link
                                href={notification.href}
                                onClick={() => void markAsRead(notification.id)}
                                className="text-[11px] font-bold text-[var(--gold)] hover:underline"
                              >
                                {meta.action}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Desktop side panel */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="bl-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--navy)] text-white">
                      <Bell className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">
                        Notification centre
                      </p>
                      <p className="text-xs text-[var(--ink-soft)]">
                        {unreadCount} unread update
                        {unreadCount === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-5">
                    <div className="flex items-start gap-3">
                      <UserCheck className="mt-0.5 h-4 w-4 text-[var(--gold)]" />
                      <p className="text-xs leading-5 text-[var(--ink-soft)]">
                        Rental requests need your attention when you are a
                        lender.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-4 w-4 text-[var(--navy-3)]" />
                      <p className="text-xs leading-5 text-[var(--ink-soft)]">
                        Payment notifications help you complete confirmed
                        bookings.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <RotateCcw className="mt-0.5 h-4 w-4 text-[var(--amber)]" />
                      <p className="text-xs leading-5 text-[var(--ink-soft)]">
                        Return reminders help keep rentals on schedule.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--green-soft)] bg-[var(--green-soft)] p-5">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--green)]" />

                    <div>
                      <p className="text-sm font-bold text-[var(--green)]">
                        Keep BookLoop fair
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">
                        Important updates about returns, condition checks and
                        disputes should not be ignored.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Mobile mark-all-read button */}
      {unreadCount > 0 && (
        <div className="fixed bottom-4 right-4 z-30 sm:hidden">
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-3 text-xs font-bold text-white shadow-lg"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      )}
    </main>
  );
}
