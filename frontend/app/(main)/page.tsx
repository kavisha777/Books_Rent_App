import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Search,
  Sparkles,
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

export default function MainHomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-[#e3d8c0] bg-[#fbf7ef]">
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] items-center gap-8 py-10 sm:w-[min(1180px,calc(100%-32px))] md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:py-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f3e4c4] px-3.5 py-2 text-[11px] font-bold text-[#b8862f]">
              <Sparkles size={14} />
              Your community bookshelf
            </div>

            <h1 className="max-w-[650px] text-4xl leading-[1] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Find a book.
              <br />
              Start a new chapter.
            </h1>

            <p className="mt-5 max-w-[570px] text-sm leading-6 text-[#5b6673] sm:text-base sm:leading-7">
              Borrow books from readers around you, or give the books
              on your shelf another journey.
            </p>

            {/* Search */}
            <div className="mt-7 flex max-w-[590px] items-center gap-2 rounded-2xl border-[1.5px] border-[#e3d8c0] bg-white p-1.5 shadow-[0_12px_35px_-25px_rgba(23,39,63,0.4)]">
              <Search className="ml-2 text-[#9aa3ae]" size={19} />

              <input
                type="text"
                placeholder="Search by title, author or ISBN"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-xs text-[#1e2a38] outline-none sm:text-sm"
              />

              <Link
                href="/explore"
                className="rounded-xl bg-[#17273f] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#213a56]"
              >
                Search
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Fiction', 'Self Development', 'Business', 'Romance'].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/explore?category=${encodeURIComponent(category)}`}
                    className="rounded-full border border-[#e3d8c0] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5b6673] transition hover:border-[#17273f] hover:text-[#17273f]"
                  >
                    {category}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Hero book visual */}
          <div className="mx-auto w-full max-w-[410px]">
            <div className="relative grid grid-cols-2 gap-3">
              <div className="book-cover cover-one h-[220px] translate-y-5 p-4 sm:h-[260px]">
                <div className="book-cover-content">
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-70">
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

              <div className="book-cover cover-two h-[220px] p-4 sm:h-[260px]">
                <div className="book-cover-content">
                  <div className="text-[9px] font-bold uppercase tracking-widest opacity-70">
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

            <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-[#e3d8c0] bg-white px-4 py-2 text-[10px] font-bold text-[#17273f] shadow-[0_12px_30px_-20px_rgba(23,39,63,0.5)]">
              <span className="h-2 w-2 rounded-full bg-[#3f7a57]" />
              24 books available nearby
            </div>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto w-[min(1180px,calc(100%-24px))] py-10 sm:w-[min(1180px,calc(100%-32px))] md:py-14">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8862f]">
              Community picks
            </p>

            <h2 className="mt-1.5 text-3xl">Popular this week</h2>

            <p className="mt-1.5 text-xs text-[#5b6673]">
              Discover books readers are loving.
            </p>
          </div>

          <Link
            href="/explore"
            className="hidden items-center gap-1 text-xs font-bold text-[#17273f] sm:flex"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <article
              key={book.title}
              className="overflow-hidden rounded-2xl border border-[#e3d8c0] bg-white transition hover:-translate-y-1"
            >
              <div className={`book-cover ${book.cover} h-[185px] p-3 sm:h-[220px]`}>
                <button
                  aria-label={`Save ${book.title}`}
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
                >
                  <Heart size={15} />
                </button>

                <div className="book-cover-content">
                  <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">
                    {book.category}
                  </div>

                  <div className="mt-1 font-serif text-base font-semibold leading-tight sm:text-lg">
                    {book.title}
                  </div>

                  <div className="mt-1 text-[9px] opacity-75">
                    {book.author}
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-base leading-tight">{book.title}</h3>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#17273f]">
                    {book.rate}
                  </span>

                  <span className="rounded-full bg-[#e4efe7] px-2 py-1 text-[9px] font-bold text-[#3f7a57]">
                    Available
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/explore"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#17273f] px-4 py-3 text-xs font-bold text-[#17273f] sm:hidden"
        >
          View all books
          <ArrowRight size={15} />
        </Link>
      </section>

      {/* Trust section */}
      <section className="border-y border-[#e3d8c0] bg-[#f0e6d2]/50">
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-4 py-10 sm:w-[min(1180px,calc(100%-32px))] md:grid-cols-3 md:py-14">
          {[
            {
              icon: BookOpen,
              title: 'Borrow locally',
              text: 'Discover books shared by readers in your community.',
            },
            {
              icon: Sparkles,
              title: 'Simple rentals',
              text: 'Request, approve, pay, borrow and return in one place.',
            },
            {
              icon: Heart,
              title: 'Share the loop',
              text: 'List books you own and help someone discover their next favourite.',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e3d8c0] bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e4c4] text-[#b8862f]">
                  <Icon size={19} />
                </div>

                <h3 className="mt-4 text-xl">{item.title}</h3>

                <p className="mt-2 text-xs leading-5 text-[#5b6673]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}