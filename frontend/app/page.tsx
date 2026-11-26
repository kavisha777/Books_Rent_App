
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from './(main)/components/AuthModal';
import MainNav from './(main)/components/MainNav';
import { isAuthenticated } from '@/lib/auth';

import {
  ArrowRight,
  BookOpen,
  Heart,
  Search,
  ShieldCheck,
  RefreshCw,
  Users,
  Leaf,
  Menu,
  X,
} from 'lucide-react';

const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    rate: 'LKR 80/day',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    colour: '#ead8bc',
    accent: '#9b7044',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    rate: 'LKR 60/day',
    cover: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    colour: '#e8b06b',
    accent: '#75411d',
  },
  {
    title: 'Ikigai',
    author: 'Héctor García',
    category: 'Lifestyle',
    rate: 'LKR 70/day',
    cover: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    colour: '#dce7eb',
    accent: '#365c62',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    rate: 'LKR 90/day',
    cover: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
    colour: '#e9dfca',
    accent: '#47644b',
  },
];

type Book = (typeof books)[number];

function BookCover({ book }: { book: Book }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex aspect-[4/4.3] w-full items-center justify-center overflow-hidden rounded-xl bg-[#ebe1d3] p-3 sm:p-4">
      {!imageError ? (
        <img
          src={book.cover}
          alt={`${book.title} book cover`}
          loading="lazy"
          onError={() => setImageError(true)}
          className="block h-full max-w-full rounded-[3px] object-contain shadow-[0_10px_20px_rgba(24,36,28,0.22)] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="flex h-full w-[78%] flex-col items-center justify-between rounded-[3px] p-4 text-center shadow-lg"
          style={{
            backgroundColor: book.colour,
            color: book.accent,
          }}
        >
          <span className="w-full border-t border-current pt-2 text-[8px] uppercase tracking-widest">
            BookLoop Collection
          </span>

          <div>
            <BookOpen className="mx-auto mb-3" size={26} />
            <h3 className="font-serif text-lg font-bold leading-tight">
              {book.title}
            </h3>
          </div>

          <p className="text-[9px] font-semibold">{book.author}</p>
        </div>
      )}
    </div>
  );
}

export default function MainHomePage() {
  const router = useRouter();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  function openAuth(mode: 'login' | 'register') {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileMenuOpen(false);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    router.push(
      query ? `/explore?search=${encodeURIComponent(query)}` : '/explore',
    );
  }

  const benefits = [
    {
      icon: Users,
      title: 'A Growing Reader Community',
      description: 'Join a community of book lovers.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Reading',
      description: 'Reduce waste, share more.',
    },
    {
      icon: Heart,
      title: 'Affordable Access',
      description: 'Enjoy great books for less.',
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf3e8] text-[#182e23] selection:bg-[#bd8738]/20">
      {/* HERO AND NAVIGATION */}
      <div className="relative isolate">
        {/* HERO BACKGROUND IMAGE */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bookloop-hero-books.png')",
            backgroundPosition: 'center 48%',
          }}
        />

        {/* HERO IMAGE OVERLAY */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f7efe2] via-[#f7efe2]/90 to-[#f7efe2]/25"
        />

        {/* AUTHENTICATED OR PUBLIC NAVIGATION */}
        {loggedIn === false ? (
          <header className="relative z-30">
            <div className="mx-auto flex h-[84px] w-[min(1200px,calc(100%-48px))] items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <BookOpen
                  size={28}
                  strokeWidth={1.8}
                  className="text-[#a8752e]"
                />

                <span className="font-serif text-[23px] font-bold tracking-tight text-[#162b20]">
                  BookLoop
                </span>
              </Link>

              <nav className="hidden items-center gap-9 text-[13.5px] font-medium text-[#1b3126] md:flex">
                <Link
                  href="/"
                  className="relative py-1 font-semibold text-[#162b20] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#162b20]"
                >
                  Home
                </Link>

                <Link
                  href="/explore"
                  className="transition hover:text-[#a8752e]"
                >
                  Explore
                </Link>

                <Link
                  href="/#how-it-works"
                  className="transition hover:text-[#a8752e]"
                >
                  How It Works
                </Link>

                <Link
                  href="/#about"
                  className="transition hover:text-[#a8752e]"
                >
                  About
                </Link>
              </nav>

              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  aria-label="Focus book search"
                  onClick={() =>
                    document.getElementById('book-search')?.focus()
                  }
                  className="mr-3 rounded-full p-2 !text-[#1b3126] transition hover:bg-black/5"
                >
                  <Search size={19} strokeWidth={2} />
                </button>

                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="rounded-full border border-[#d6c2a3] bg-[#f7efe2]/70 px-6 py-2 text-[13px] font-semibold !text-[#182e23] backdrop-blur-sm transition hover:bg-[#efe2ce]"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="rounded-full bg-[#b8843b] px-6 py-2 text-[13px] font-semibold !text-white shadow-sm transition hover:bg-[#a37230]"
                >
                  Sign Up
                </button>
              </div>

              <button
                type="button"
                className="rounded-lg p-2 !text-[#182e23] md:hidden"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="absolute left-0 top-full w-full border-t border-[#eadfce] bg-[#faf3e8] p-5 shadow-xl md:hidden">
                <nav className="flex flex-col gap-4 text-sm font-medium text-[#182e23]">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>

                  <Link
                    href="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Explore
                  </Link>

                  <Link
                    href="/#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>

                  <Link
                    href="/#about"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  <button
                    type="button"
                    onClick={() => openAuth('login')}
                    className="mt-2 rounded-full border border-[#b8843b] bg-transparent py-2.5 font-semibold !text-[#182e23]"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => openAuth('register')}
                    className="rounded-full bg-[#b8843b] py-2.5 font-semibold !text-white"
                  >
                    Sign Up
                  </button>
                </nav>
              </div>
            )}
          </header>
        ) : loggedIn === true ? (
          <MainNav />
        ) : (
          <div className="h-[84px]" aria-hidden="true" />
        )}

        {/* HERO CONTENT */}
        <section className="relative z-10 mx-auto flex min-h-[470px] w-[min(1200px,calc(100%-48px))] items-center pb-20 pt-6 sm:min-h-[500px] lg:min-h-[520px]">
          <div className="max-w-[540px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfa86e] bg-[#f4e6d0]/90 px-3.5 py-1 text-[12px] font-medium text-[#22382b]">
              <BookOpen size={14} className="text-[#8a5d22]" />
              <span>Share • Borrow • Read</span>
            </div>

            <h1 className="font-serif text-[46px] font-bold leading-[1.06] tracking-tight text-[#162e22] sm:text-[60px] lg:text-[66px]">
              Find a book.
              <br />
              Start a new{' '}
              <span className="font-normal italic text-[#a8752e]">
                chapter.
              </span>
            </h1>

            <p className="mt-5 max-w-[420px] text-[15px] leading-[1.65] text-[#28332c]">
              Borrow books from readers around you,
              <br className="hidden sm:inline" /> or give the books on your
              shelf another journey.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#1a3928] px-6 py-3 text-[13.5px] font-semibold !text-white shadow-sm transition hover:bg-[#274e38]"
              >
                Explore Books
                <ArrowRight size={16} />
              </Link>

              {loggedIn === false && (
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="rounded-full border border-[#1a3928] bg-[#f7efe2]/60 px-6 py-3 text-[13.5px] font-semibold !text-[#1a3928] backdrop-blur-sm transition hover:bg-[#1a3928] hover:!text-white"
                >
                  Join BookLoop
                </button>
              )}

              {loggedIn === true && (
                <Link
                  href="/list-book"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1a3928] bg-[#f7efe2]/60 px-6 py-3 text-[13.5px] font-semibold !text-[#1a3928] backdrop-blur-sm transition hover:bg-[#1a3928] hover:!text-white"
                >
                  List Your Book
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING SEARCH BAR */}
      <div className="relative z-20 mx-auto -mt-7 w-[min(640px,calc(100%-32px))]">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 rounded-full border border-[#e6dac8] bg-[#fffdf9] p-1.5 pl-5 shadow-[0_10px_28px_rgba(24,46,35,0.08)]"
        >
          <Search size={18} className="shrink-0 text-[#2b3d33]" />

          <input
            id="book-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by title, author or ISBN..."
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[13.5px] text-[#182e23] outline-none placeholder:text-[#7c766b]"
          />

          <button
            type="submit"
            className="rounded-full bg-[#1a3928] px-7 py-2.5 text-[13px] font-semibold !text-white transition hover:bg-[#274e38]"
          >
            Search
          </button>
        </form>
      </div>

      {/* THREE VALUE PROPOSITIONS */}
      <section
        id="how-it-works"
        className="border-b border-[#ece0ce] bg-[#faf3e8] pb-9 pt-10"
      >
        <div className="mx-auto grid w-[min(980px,calc(100%-48px))] gap-6 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: 'Borrow Locally',
              text: 'From people nearby',
            },
            {
              icon: ShieldCheck,
              title: 'Safe & Secure',
              text: 'Trusted community',
            },
            {
              icon: RefreshCw,
              title: 'Give Books a Second Life',
              text: 'Share the joy of reading',
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center justify-center gap-3.5 py-1 ${
                  index !== 0 ? 'sm:border-l sm:border-[#d8c19e]' : ''
                }`}
              >
                <Icon
                  size={34}
                  strokeWidth={1.6}
                  className="shrink-0 text-[#182e23]"
                />

                <div>
                  <h3 className="text-[14px] font-bold text-[#182e23]">
                    {item.title}
                  </h3>

                  <p className="mt-0.5 text-[12px] text-[#5c594f]">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR BOOKS */}
      <section className="mx-auto w-[min(1200px,calc(100%-48px))] py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a8752e]">
              Community Picks
            </p>

            <h2 className="mt-1 font-serif text-[30px] font-bold tracking-tight text-[#162e22] sm:text-[34px]">
              Popular Books This Week
            </h2>
          </div>

          <Link
            href="/explore"
            className="hidden items-center gap-1.5 text-[13px] font-semibold text-[#182e23] transition hover:text-[#a8752e] sm:flex"
          >
            View All Books
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <article key={book.title} className="group flex flex-col">
              <Link
                href={`/explore?search=${encodeURIComponent(book.title)}`}
                className="relative block overflow-hidden rounded-2xl border border-[#e8dccb] bg-[#ebe1d3] transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <BookCover book={book} />

                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#182e23] shadow-sm"
                >
                  <Heart size={16} strokeWidth={1.8} />
                </span>
              </Link>

              <div className="flex flex-1 flex-col pt-3.5">
                <h3 className="truncate text-[15px] font-bold text-[#162e22]">
                  {book.title}
                </h3>

                <p className="mt-0.5 text-[12.5px] text-[#555248]">
                  {book.author}
                </p>

                <div className="mt-2.5">
                  <span className="inline-block rounded-md border border-[#e3d2b7] bg-[#f3e6d0] px-2.5 py-0.5 text-[11px] font-medium text-[#4a4235]">
                    {book.category}
                  </span>
                </div>

                <p className="mt-3 text-[13.5px] font-bold text-[#162e22]">
                  {book.rate}
                </p>

                <Link
                  href={`/explore?search=${encodeURIComponent(book.title)}`}
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-[#1a3928] py-2.5 text-[12.5px] font-semibold !text-white transition hover:bg-[#274e38]"
                >
                  Rent Now
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/explore"
          className="mt-7 flex items-center justify-center gap-2 text-xs font-bold text-[#182e23] sm:hidden"
        >
          View All Books
          <ArrowRight size={15} />
        </Link>
      </section>

      {/* WHY BOOKLOOP */}
      <section id="about" className="relative mt-4 overflow-hidden bg-[#f2dfc3]">
        <div className="mx-auto grid w-[min(1200px,calc(100%-48px))] items-center gap-8 py-12 md:grid-cols-[1fr_1.55fr_0.95fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a8752e]">
              Why BookLoop?
            </p>

            <h2 className="mt-2 font-serif text-[34px] font-bold leading-[1.08] text-[#162e22] sm:text-[38px]">
              More than
              <br />
              just books.
            </h2>

            <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-[#454238]">
              A community where readers connect, share and discover stories
              together.
            </p>

            <Link
              href="/explore"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1a3928] px-5 py-2.5 text-[12.5px] font-semibold !text-white transition hover:bg-[#274e38]"
            >
              Explore Books
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`flex flex-col items-center px-4 text-center ${
                    index > 0 ? 'sm:border-l sm:border-[#cfa972]' : ''
                  }`}
                >
                  <Icon
                    size={30}
                    className="text-[#1a3928]"
                    strokeWidth={1.7}
                  />

                  <h3 className="mt-3 text-[13px] font-bold leading-[1.35] text-[#162e22]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-[11.5px] leading-[1.45] text-[#575246]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative hidden h-[260px] min-w-0 overflow-hidden md:block">
            <img
              src="/images/bookloop-reader-illustration.png"
              alt="A reader enjoying a book beside a stack of books and plants"
              loading="lazy"
              className="pointer-events-none absolute right-0 top-0 h-full w-[145%] max-w-none object-cover object-right"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto w-[min(1200px,calc(100%-48px))] py-10">
        <div className="relative flex min-h-[160px] items-center overflow-hidden rounded-2xl bg-[#1a3928] px-6 py-7 sm:min-h-[170px] sm:px-10">
          <img
            src="/images/bookloop-open-book-banner.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-y-0 left-0 hidden h-full w-[31%] object-cover object-[center_55%] sm:block"
          />

          <div className="absolute inset-y-0 left-[22%] hidden w-[12%] bg-gradient-to-r from-transparent to-[#1a3928] sm:block" />

          <svg
            aria-hidden="true"
            viewBox="0 0 160 140"
            fill="none"
            className="pointer-events-none absolute bottom-0 right-0 h-full w-40 text-[#c8984c]/25"
          >
            <path
              d="M150 140C135 95 105 60 60 40M125 105C105 100 90 108 82 122M112 80C92 72 75 78 65 92M138 68C122 50 102 48 88 58M145 120C155 95 152 70 135 45"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            <ellipse
              cx="76"
              cy="124"
              rx="10"
              ry="5"
              transform="rotate(-25 76 124)"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <ellipse
              cx="60"
              cy="94"
              rx="11"
              ry="5"
              transform="rotate(-35 60 94)"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <ellipse
              cx="83"
              cy="60"
              rx="10"
              ry="5"
              transform="rotate(-20 83 60)"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          <div className="relative z-10 mx-auto max-w-[490px] text-center sm:ml-[31%] sm:mr-6 sm:text-left">
            <h2 className="font-serif text-[22px] font-bold tracking-tight text-[#faf3e8] sm:text-[26px]">
              {loggedIn
                ? 'Ready for your next read?'
                : 'Every book deserves another reader.'}
            </h2>

            <p className="mt-1.5 text-[13px] leading-[1.55] text-[#e5dfd3]">
              {loggedIn
                ? 'Discover more books and find your next favourite story.'
                : 'Join BookLoop and be part of a community that believes great stories should be shared.'}
            </p>
          </div>

          {loggedIn === false && (
            <button
              type="button"
              onClick={() => openAuth('register')}
              className="relative z-10 ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-[#cfa052] px-6 py-3 text-[13px] font-bold !text-[#162e22] shadow-sm transition hover:bg-[#deb064] sm:inline-flex"
            >
              Get Started
              <ArrowRight size={15} />
            </button>
          )}

          {loggedIn === true && (
            <Link
              href="/explore"
              className="relative z-10 ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-[#cfa052] px-6 py-3 text-[13px] font-bold !text-[#162e22] shadow-sm transition hover:bg-[#deb064] sm:inline-flex"
            >
              Explore Books
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#183024] text-[#faf3e8]">
        <div className="mx-auto flex w-[min(1200px,calc(100%-48px))] flex-col items-center justify-between gap-6 py-9 md:flex-row">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen
              size={30}
              strokeWidth={1.7}
              className="text-[#faf3e8]"
            />

            <div>
              <span className="block font-serif text-[21px] font-bold leading-none">
                BookLoop
              </span>

              <span className="mt-1 block text-[11px] text-[#cbd3cd]">
                Read. Share. Repeat.
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap justify-center gap-7 text-[12.5px] font-medium text-[#e6ece8]">
            <Link href="/" className="transition hover:text-[#cfa052]">
              Home
            </Link>

            <Link href="/explore" className="transition hover:text-[#cfa052]">
              Explore
            </Link>

            <Link
              href="/#how-it-works"
              className="transition hover:text-[#cfa052]"
            >
              How It Works
            </Link>

            <Link href="/#about" className="transition hover:text-[#cfa052]">
              About
            </Link>

            <Link href="/contact" className="transition hover:text-[#cfa052]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-[#faf3e8]">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition hover:text-[#cfa052]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="transition hover:text-[#cfa052]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="transition hover:text-[#cfa052]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="transition hover:text-[#cfa052]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION MODAL */}
      {loggedIn === false && (
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
      )}
    </main>
  );
}
