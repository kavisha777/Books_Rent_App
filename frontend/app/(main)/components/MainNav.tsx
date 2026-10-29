'use client';

import AuthModal from '../../(main)/components/AuthModal';
import { isAuthenticated , getAccessToken} from '../../../lib/auth';
import { apiRequest } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpen,
  Compass,
  Home,
  Plus,
  UserRound,
} from 'lucide-react';


const desktopLinks = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
  },
 
];

const mobileLinks = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Compass,
  },
 
  {
    href: '/notifications',
    label: 'Alerts',
    icon: Bell,
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(href);
}

export default function MainNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const [authOpen, setAuthOpen] = useState(false);
const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
const [loggedIn, setLoggedIn] = useState(false);

useEffect(() => {
  setLoggedIn(isAuthenticated());
}, []);

  useEffect(() => {
    // MainNav only renders inside the authenticated route group, so a missing
    // token means this mount never has a badge to clear.
    if (!getAccessToken()) {
      return;
    }

    // Re-read whenever the route changes, so opening the centre clears the dot.
    let cancelled = false;

    apiRequest<{ data?: { unreadCount?: number } }>('/notifications?limit=1', {
      auth: true,
    })
      .then((response) => {
        if (!cancelled) {
          setUnreadCount(response.data?.unreadCount ?? 0);
        }
      })
      .catch(() => {
        // The dot is decorative when unavailable; never block navigation.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <>
      {/* Desktop navigation */}
      <header className="sticky top-0 z-40 hidden border-b border-[#e3d8c0] bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17273f] text-white">
              <BookOpen size={21} />
            </div>

            <div>
              <div className="font-serif text-xl font-semibold leading-none text-[#17273f]">
                BookLoop
              </div>

              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9aa3ae]">
                Borrow. Lend. Read.
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-7">
            {desktopLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                    active
                      ? 'text-[#17273f]'
                      : 'text-[#5b6673] hover:text-[#17273f]'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isActive(pathname, '/notifications')
                  ? 'bg-[#f0e6d2] text-[#17273f]'
                  : 'text-[#5b6673] hover:bg-[#f0e6d2]'
              }`}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8862f] px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

  <button
  type="button"
  aria-label="Profile"
  onClick={() => {
    if (isAuthenticated()) {
      window.location.href = '/profile';
    } else {
      setAuthMode('login');
      setAuthOpen(true);
    }
  }}
  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
    isActive(pathname, '/profile')
      ? 'bg-[#17273f] text-white'
      : 'bg-[#f0e6d2] text-[#17273f] hover:bg-[#e7dac0]'
  }`}
>
  <UserRound size={18} />
</button>

            
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e3d8c0] bg-white px-1 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 md:hidden">
        <div className="mx-auto flex max-w-[600px] items-end justify-around">
          {mobileLinks.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-[68px] flex-col items-center gap-1 text-[9.5px] font-bold ${
                  active ? 'text-[#17273f]' : 'text-[#9aa3ae]'
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
                {item.label}
              </Link>
            );
          })}

          {/* Floating action button */}
          <Link
            href="/list-book"
            aria-label="List a book"
            className="relative -mt-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17273f] text-white shadow-[0_10px_25px_-10px_rgba(23,39,63,0.7)]"
          >
            <Plus size={22} />
          </Link>

         {mobileLinks.slice(2).map((item) => {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);

  return (
    <Link
      key={item.href}
      href={item.href}
      className={`flex w-[68px] flex-col items-center gap-1 text-[9.5px] font-bold ${
        active ? 'text-[#17273f]' : 'text-[#9aa3ae]'
      }`}
    >
      <span className="relative">
        <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
        {item.href === '/notifications' && unreadCount > 0 && (
          <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#b8862f]" />
        )}
      </span>
      {item.label}
    </Link>
  );
})}

<button
  type="button"
  aria-label="Profile"
  onClick={() => {
    if (isAuthenticated()) {
      window.location.href = '/profile';
    } else {
      setAuthMode('login');
      setAuthOpen(true);
    }
  }}
  className="flex w-[68px] flex-col items-center gap-1 text-[9.5px] font-bold text-[#9aa3ae]"
>
  <UserRound size={19} />
  Profile
</button>
        </div>
         
      </nav>
      <AuthModal
  open={authOpen}
  initialMode={authMode}
  onClose={() => setAuthOpen(false)}
  onSuccess={() => {
    setAuthOpen(false);
    setLoggedIn(true);
    window.location.reload();
  }}
/>
    </>

    
  );
 
}