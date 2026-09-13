'use client';

import {
  ArrowRight,
  BookOpen,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

const books = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    rate: 'LKR 80/day',
    cover: 'cover-one',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    rate: 'LKR 60/day',
    cover: 'cover-two',
  },
  {
    title: 'Ikigai',
    author: 'Héctor García',
    category: 'Lifestyle',
    rate: 'LKR 70/day',
    cover: 'cover-three',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    rate: 'LKR 90/day',
    cover: 'cover-four',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      {/* Desktop / mobile navigation */}
      <header className="sticky top-0 z-30 border-b border-[#e3d8c0] bg-white/95 backdrop-blur">
        <div className="bl-container flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17273f] text-white">
              <BookOpen size={21} strokeWidth={2} />
            </div>

            <div>
              <div className="font-serif text-xl font-semibold leading-none text-[#17273f]">
                BookLoop
              </div>
              <div className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-[0.16em] text-[#9aa3ae] sm:block">
                Borrow. Lend. Read.
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#5b6673] md:flex">
            <a className="text-[#17273f]" href="#">
              Home
            </a>
            <a href="#">Explore</a>
            <a href="#">My Rentals</a>
            <a href="#">List a Book</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#5b6673] hover:bg-[#f0e6d2] sm:flex"
            >
              <Search size={19} />
            </button>

            <button
              aria-label="Profile"
              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#f0e6d2] text-[#17273f] sm:flex"
            >
              <UserRound size={18} />
            </button>

            <button
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0e6d2] text-[#17273f] md:hidden"
            >
              <Menu size={20} />
            </button>

            <button className="bl-button bl-button-primary hidden sm:inline-flex">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#e3d8c0] bg-[#fbf7ef]">
        <div className="bl-container grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f3e4c4] px-3.5 py-2 text-xs font-bold text-[#b8862f]">
              <Sparkles size={14} />
              A better way to share books
            </div>

            <h1 className="max-w-[650px] text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl md:text-7xl">
              Your next great read is closer than you think.
            </h1>

            <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#5b6673] sm:text-base">
              Discover books from people around you, borrow them for a
              little while, and lend the books sitting on your shelf.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="bl-button bl-button-primary">
                Explore Books
                <ArrowRight size={17} />
              </button>

              <button className="bl-button bl-button-outline">
                List Your Book
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#5b6673]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#3f7a57]" />
                Secure rentals
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#b8862f]" />
                Local readers
              </div>

              <div className="flex items-center gap-2">
                <Heart size={16} className="text-[#b14a3d]" />
                Community driven
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -right-2 top-8 h-40 w-40 rounded-full bg-[#e7dac0] blur-2xl" />
            <div className="absolute -bottom-3 left-0 h-32 w-32 rounded-full bg-[#f3e4c4] blur-2xl" />

            <div className="relative grid grid-cols-2 gap-3">
              <div className="book-cover cover-one h-[245px] translate-y-5 p-4 shadow-[0_24px_50px_-30px_rgba(23,39,63,0.45)]">
                <div className="book-cover-content">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Habit
                  </div>
                  <div className="mt-1 font-serif text-xl font-semibold">
                    Atomic Habits
                  </div>
                  <div className="mt-1 text-[10px] opacity-75">
                    James Clear
                  </div>
                </div>
              </div>

              <div className="book-cover cover-two h-[245px] p-4 shadow-[0_24px_50px_-30px_rgba(23,39,63,0.45)]">
                <div className="book-cover-content">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Fiction
                  </div>
                  <div className="mt-1 font-serif text-xl font-semibold">
                    The Alchemist
                  </div>
                  <div className="mt-1 text-[10px] opacity-75">
                    Paulo Coelho
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-[#e3d8c0] bg-white px-4 py-2 text-xs font-bold text-[#17273f] shadow-[0_12px_30px_-20px_rgba(23,39,63,0.5)]">
              <span className="h-2 w-2 rounded-full bg-[#3f7a57]" />
              24 books available nearby
            </div>
          </div>
        </div>
      </section>

      {/* Popular books */}
      <section className="bl-container py-12 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
              Fresh from the community
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl">
              Popular books
            </h2>

            <p className="mt-2 text-sm text-[#5b6673]">
              Books readers are discovering right now.
            </p>
          </div>

          <button className="hidden items-center gap-1 text-sm font-bold text-[#17273f] sm:flex">
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <article
              key={book.title}
              className="bl-card overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className={`book-cover ${book.cover} h-[210px] p-3`}>
                <button
                  aria-label={`Save ${book.title}`}
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
                >
                  <Heart size={15} />
                </button>

                <div className="book-cover-content">
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                    {book.category}
                  </div>
                  <div className="mt-1 font-serif text-lg font-semibold leading-tight">
                    {book.title}
                  </div>
                  <div className="mt-1 text-[10px] opacity-75">
                    {book.author}
                  </div>
                </div>
              </div>

              <div className="p-3.5">
                <div className="text-[11px] font-semibold text-[#5b6673]">
                  {book.category}
                </div>

                <h3 className="mt-1 text-base leading-tight">
                  {book.title}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#17273f]">
                    {book.rate}
                  </span>

                  <span className="rounded-full bg-[#e4efe7] px-2.5 py-1 text-[10px] font-bold text-[#3f7a57]">
                    Available
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="bl-button bl-button-outline mt-6 w-full sm:hidden">
          View all books
          <ArrowRight size={16} />
        </button>
      </section>

      {/* How it works */}
      <section className="border-y border-[#e3d8c0] bg-[#f0e6d2]/45">
        <div className="bl-container py-12 md:py-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
              Simple by design
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl">
              How BookLoop works
            </h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Discover',
                text: 'Find books listed by readers in your community.',
              },
              {
                number: '02',
                title: 'Borrow',
                text: 'Request a book, get owner approval and confirm your rental.',
              },
              {
                number: '03',
                title: 'Return & share',
                text: 'Return it safely, complete the condition check and review.',
              },
            ].map((step) => (
              <div key={step.number} className="bl-card p-5">
                <div className="font-serif text-3xl text-[#b8862f]">
                  {step.number}
                </div>

                <h3 className="mt-4 text-xl">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-[#5b6673]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#17273f] text-white">
        <div className="bl-container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-serif text-xl">BookLoop</div>
            <p className="mt-1 text-xs text-white/60">
              Borrow. Lend. Read.
            </p>
          </div>

          <p className="text-xs text-white/50">
            A community marketplace for book lovers.
          </p>
        </div>
      </footer>
    </main>
  );
}