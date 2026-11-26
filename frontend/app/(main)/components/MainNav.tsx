
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  Bell,
  BookOpen,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';

import {
  getAccessToken,
  getCurrentUser,
  isAuthenticated,
  logout,
  type AuthUser,
} from '@/lib/auth';

import AuthModal from './AuthModal';

const desktopLinks = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Explore',
    href: '/explore',
  },
];

type NotificationResponse = {
  unreadCount?: number;
  data?: {
    unreadCount?: number;
  };
};

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    const authenticated = isAuthenticated();

    setLoggedIn(authenticated);

    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  useEffect(() => {
    if (loggedIn !== true || !getAccessToken()) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    async function fetchNotifications() {
      try {
        const response = await apiRequest<NotificationResponse>(
          '/notifications?limit=1',
          { auth: true },
        );

        if (!cancelled) {
          setUnreadCount(
            response.unreadCount ??
              response.data?.unreadCount ??
              0,
          );
        }
      } catch {
        if (!cancelled) {
          setUnreadCount(0);
        }
      }
    }

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  function openAuth(mode: 'login' | 'register') {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  function handleAuthSuccess() {
    const user = getCurrentUser();

    setCurrentUser(user);
    setLoggedIn(true);
    setUnreadCount(0);
    setAuthOpen(false);

    if (user?.role === 'ADMIN') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }

    router.refresh();
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggedIn(false);
      setCurrentUser(null);
      setUnreadCount(0);
      setAuthOpen(false);

      router.replace('/');
      router.refresh();

      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <header className="sticky top-0 z-50 hidden border-b border-[#e8dfd0] bg-[#faf3e8]/95 backdrop-blur-md md:block">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#182e23] text-[#faf3e8]">
              <BookOpen size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-[#182e23]">
              BookLoop
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center gap-8">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-[#b8843b]'
                    : 'text-[#526052] hover:text-[#182e23]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Guest Actions */}
          {loggedIn === false && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#182e23] transition hover:bg-[#eee5d7]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => openAuth('register')}
                className="rounded-full bg-[#182e23] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#294936]"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Authenticated Actions */}
          {loggedIn === true && (
            <div className="flex items-center gap-4">

              {/* Notifications */}
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative rounded-full p-2 text-[#526052] transition hover:bg-[#eee5d7] hover:text-[#182e23]"
              >
                <Bell size={21} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8843b] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Admin Dashboard */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive('/admin')
                      ? 'bg-[#e9dfcf] text-[#182e23]'
                      : 'text-[#526052] hover:bg-[#eee5d7]'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </Link>
              )}

              {/* Normal User Profile */}
              {!isAdmin && (
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive('/profile')
                      ? 'bg-[#e9dfcf] text-[#182e23]'
                      : 'text-[#526052] hover:bg-[#eee5d7]'
                  }`}
                >
                  <UserRound size={18} />
                  Profile
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-full border border-[#d9cdbb] px-4 py-2 text-sm font-semibold text-[#8a463c] transition hover:bg-[#f2e5dc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8dfd0] bg-[#faf3e8]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-3">

          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-xs font-semibold ${
              isActive('/')
                ? 'text-[#b8843b]'
                : 'text-[#657064]'
            }`}
          >
            <Home size={21} />
            Home
          </Link>

          {/* Explore */}
          <Link
            href="/explore"
            className={`flex flex-col items-center gap-1 text-xs font-semibold ${
              isActive('/explore')
                ? 'text-[#b8843b]'
                : 'text-[#657064]'
            }`}
          >
            <Compass size={21} />
            Explore
          </Link>

          {/* Guest Actions */}
          {loggedIn === false && (
            <>
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="flex flex-col items-center gap-1 text-xs font-semibold text-[#657064]"
              >
                <UserRound size={21} />
                Login
              </button>

              <button
                type="button"
                onClick={() => openAuth('register')}
                className="flex flex-col items-center gap-1 text-xs font-semibold text-[#657064]"
              >
                <Plus size={21} />
                Sign Up
              </button>
            </>
          )}

          {/* Authenticated Actions */}
          {loggedIn === true && (
            <>
              {/* Admin Dashboard for ADMIN */}
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                    isActive('/admin')
                      ? 'text-[#b8843b]'
                      : 'text-[#657064]'
                  }`}
                >
                  <LayoutDashboard size={21} />
                  Admin
                </Link>
              ) : (
                <Link
                  href="/list-book"
                  className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                    isActive('/list-book')
                      ? 'text-[#b8843b]'
                      : 'text-[#657064]'
                  }`}
                >
                  <Plus size={21} />
                  List Book
                </Link>
              )}

              {/* Notifications */}
              <Link
                href="/notifications"
                className={`relative flex flex-col items-center gap-1 text-xs font-semibold ${
                  isActive('/notifications')
                    ? 'text-[#b8843b]'
                    : 'text-[#657064]'
                }`}
              >
                <Bell size={21} />

                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8843b] px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}

                Alerts
              </Link>

              {/* Profile for normal users */}
              {!isAdmin && (
                <Link
                  href="/profile"
                  className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                    isActive('/profile')
                      ? 'text-[#b8843b]'
                      : 'text-[#657064]'
                  }`}
                >
                  <UserRound size={21} />
                  Profile
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex flex-col items-center gap-1 text-xs font-semibold text-[#8a463c] disabled:opacity-50"
              >
                <LogOut size={21} />
                {loggingOut ? 'Please wait' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Login and Registration Popup */}
      {loggedIn === false && (
        <AuthModal
          open={authOpen}
          initialMode={authMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
