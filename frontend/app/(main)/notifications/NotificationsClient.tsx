'use client';

import { useMemo, useState } from 'react';
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

type NotificationType =
  | 'RENTAL_REQUEST'
  | 'APPROVED'
  | 'PAYMENT'
  | 'RETURN'
  | 'DISPUTE'
  | 'REVIEW';

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  action?: string;
  href?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'RENTAL_REQUEST',
    title: 'New rental request',
    message:
      'Someone has requested to rent The Psychology of Money from your library.',
    time: '10 min ago',
    unread: true,
    action: 'Review request',
    href: '/rentals',
  },
  {
    id: 2,
    type: 'APPROVED',
    title: 'Rental request approved',
    message:
      'Your request for Atomic Habits has been approved by the lender.',
    time: '1 hour ago',
    unread: true,
    action: 'View rental',
    href: '/rentals',
  },
  {
    id: 3,
    type: 'PAYMENT',
    title: 'Payment required',
    message:
      'Complete the rental payment and security deposit to confirm your booking.',
    time: '2 hours ago',
    unread: true,
    action: 'View rental',
    href: '/rentals',
  },
  {
    id: 4,
    type: 'RETURN',
    title: 'Return reminder',
    message:
      'The Psychology of Money is due for return in 2 days.',
    time: 'Yesterday',
    unread: false,
    action: 'View rental',
    href: '/rentals',
  },
  {
    id: 5,
    type: 'REVIEW',
    title: 'Leave a review',
    message:
      'Your recent rental is complete. Share your experience with the lender.',
    time: '2 days ago',
    unread: false,
    action: 'View completed rental',
    href: '/rentals',
  },
  {
    id: 6,
    type: 'DISPUTE',
    title: 'Condition review opened',
    message:
      'BookLoop is reviewing the condition report submitted for a recent rental.',
    time: '4 days ago',
    unread: false,
    action: 'View details',
    href: '/rentals',
  },
];

const typeMeta: Record<
  NotificationType,
  {
    icon: typeof Bell;
    label: string;
    className: string;
  }
> = {
  RENTAL_REQUEST: {
    icon: UserCheck,
    label: 'Rental request',
    className: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
  APPROVED: {
    icon: Check,
    label: 'Approved',
    className: 'bg-[var(--green-soft)] text-[var(--green)]',
  },
  PAYMENT: {
    icon: CreditCard,
    label: 'Payment',
    className: 'bg-[var(--cream)] text-[var(--navy-3)]',
  },
  RETURN: {
    icon: RotateCcw,
    label: 'Return',
    className: 'bg-[var(--amber-soft)] text-[var(--amber)]',
  },
  DISPUTE: {
    icon: ShieldAlert,
    label: 'Dispute',
    className: 'bg-[var(--red-soft)] text-[var(--red)]',
  },
  REVIEW: {
    icon: Star,
    label: 'Review',
    className: 'bg-[var(--gold-soft)] text-[var(--gold)]',
  },
};

export default function NotificationsClient() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  }

  function removeNotification(id: number) {
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

        {notifications.length === 0 ? (
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
                      notification.unread
                        ? 'border-[var(--cream-2)] bg-white'
                        : 'bg-white'
                    }`}
                  >
                    {notification.unread && (
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

                              {notification.unread && (
                                <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
                              )}
                            </div>

                            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                              {notification.message}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeNotification(notification.id)
                            }
                            aria-label={`Remove ${notification.title}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--ink-muted)] transition hover:bg-[var(--offwhite)] hover:text-[var(--navy)]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
                            <Clock3 className="h-3.5 w-3.5" />
                            {notification.time}
                          </span>

                          <span className="text-[11px] font-semibold text-[var(--ink-muted)]">
                            {meta.label}
                          </span>

                          <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
                            {notification.unread && (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification.id)}
                                className="text-[11px] font-bold text-[var(--navy-3)] hover:underline"
                              >
                                Mark as read
                              </button>
                            )}

                            {notification.action && notification.href && (
                              <Link
                                href={notification.href}
                                onClick={() => markAsRead(notification.id)}
                                className="text-[11px] font-bold text-[var(--gold)] hover:underline"
                              >
                                {notification.action}
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