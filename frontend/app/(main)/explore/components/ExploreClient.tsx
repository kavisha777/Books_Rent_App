'use client';

import Link from 'next/link';
import {
  BookOpen,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../../../lib/api';

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  dailyRate: number;
  condition?: string;
  status?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
};

type BooksResponse = {
  success?: boolean;
  message?: string;
  data?:
    | Book[]
    | {
        books?: Book[];
        items?: Book[];
      };
  books?: Book[];
};

const fallbackBooks: Book[] = [];

const categories = [
  'All',
  'Business',
  'Self Development',
  'Fiction',
  'Technology',
  'Biography',
  'Finance',
];

function extractBooks(response: BooksResponse): Book[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.books)) {
    return response.books;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.books)
  ) {
    return response.data.books;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.items)
  ) {
    return response.data.items;
  }

  return [];
}

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString()}/day`;
}

function getCoverClass(index: number) {
  const classes = [
    'cover-one',
    'cover-two',
    'cover-three',
    'cover-four',
  ];

  return classes[index % classes.length];
}

export default function ExploreClient() {
  const [books, setBooks] = useState<Book[]>(fallbackBooks);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [sort, setSort] = useState('Recommended');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError('');

        const response = await apiRequest<BooksResponse>('/books');

        if (!mounted) {
          return;
        }

        setBooks(extractBooks(response));
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load books right now.',
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      mounted = false;
    };
  }, []);

  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        books
          .map((book) => book.category)
          .filter(Boolean),
      ),
    );

    return ['All', ...uniqueCategories];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter((book) => {
        return (
          book.title?.toLowerCase().includes(searchTerm) ||
          book.author?.toLowerCase().includes(searchTerm) ||
          book.category?.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (category !== 'All') {
      result = result.filter(
        (book) =>
          book.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    if (availability === 'Available') {
      result = result.filter(
        (book) =>
          !book.status ||
          book.status.toUpperCase() === 'AVAILABLE',
      );
    }

    if (sort === 'Price low') {
      result.sort(
        (a, b) =>
          Number(a.dailyRate || 0) - Number(b.dailyRate || 0),
      );
    }

    if (sort === 'Price high') {
      result.sort(
        (a, b) =>
          Number(b.dailyRate || 0) - Number(a.dailyRate || 0),
      );
    }

    if (sort === 'Rating') {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0),
      );
    }

    return result;
  }, [books, search, category, availability, sort]);

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setAvailability('All');
    setSort('Recommended');
  }

  const hasFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    availability !== 'All' ||
    sort !== 'Recommended';

  return (
    <main className="min-h-screen bg-[var(--offwhite)] pb-24 md:pb-10">
      <div className="bl-container pt-6 md:pt-10">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            BookLoop Library
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl">
                Explore books
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
                Discover books shared by readers in the BookLoop
                community.
              </p>
            </div>

            <div className="hidden rounded-full bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--navy)] md:block">
              {books.length} {books.length === 1 ? 'book' : 'books'} listed
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author or category..."
              className="w-full rounded-2xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--navy)]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-bold text-[var(--navy)] md:hidden"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Desktop layout */}
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden md:block">
            <div className="sticky top-6 rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={17} />
                  <h2 className="font-sans text-sm font-bold text-[var(--navy)]">
                    Filters
                  </h2>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[var(--gold)]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Category
                </p>

                <div className="space-y-1">
                  {availableCategories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        category === item
                          ? 'bg-[var(--cream)] font-bold text-[var(--navy)]'
                          : 'text-[var(--ink-soft)] hover:bg-[var(--offwhite)]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Availability
                </p>

                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Available</option>
                </select>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Sort by
                </p>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Price low</option>
                  <option>Price high</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Books */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-[var(--ink-soft)]">
                {loading
                  ? 'Loading books...'
                  : `${filteredBooks.length} ${
                      filteredBooks.length === 1 ? 'result' : 'results'
                    }`}
              </p>

              <div className="relative hidden sm:block md:hidden">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none rounded-xl border border-[var(--border)] bg-white py-2 pl-3 pr-9 text-xs font-semibold outline-none"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Price low</option>
                  <option>Price high</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
                  >
                    <div className="h-64 animate-pulse bg-[var(--cream)]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 animate-pulse rounded bg-[var(--cream)]" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--cream)]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--cream)]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-[var(--red-soft)] bg-[var(--red-soft)] p-8 text-center">
                <BookOpen
                  size={30}
                  className="mx-auto mb-4 text-[var(--red)]"
                />

                <h2 className="font-sans text-lg font-bold text-[var(--navy)]">
                  We couldn't load the books
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ink-soft)]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Book grid */}
            {!loading && !error && filteredBooks.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {filteredBooks.map((book, index) => {
                  const isAvailable =
                    !book.status ||
                    book.status.toUpperCase() === 'AVAILABLE';

                  return (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`book-cover ${getCoverClass(index)} h-64 sm:h-72`}
                        style={
                          book.coverImage
                            ? {
                                backgroundImage: `url(${book.coverImage})`,
                              }
                            : undefined
                        }
                      >
                        <div className="book-cover-content p-4">
                          <p className="line-clamp-2 font-serif text-xl leading-tight text-white">
                            {book.title}
                          </p>

                          <p className="mt-1 text-xs text-white/75">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[var(--cream)] px-2.5 py-1 text-[10px] font-bold text-[var(--navy)]">
                            {book.category || 'Book'}
                          </span>

                          <span
                            className={`text-[10px] font-bold ${
                              isAvailable
                                ? 'text-[var(--green)]'
                                : 'text-[var(--red)]'
                            }`}
                          >
                            {isAvailable
                              ? 'Available'
                              : 'Unavailable'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-[var(--navy)]">
                            {formatPrice(book.dailyRate)}
                          </p>

                          {book.rating !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-semibold">
                              <Star
                                size={13}
                                className="fill-[var(--gold)] text-[var(--gold)]"
                              />
                              {Number(book.rating).toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredBooks.length === 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cream)]">
                  <BookOpen size={25} className="text-[var(--navy)]" />
                </div>

                <h2 className="text-2xl">No books found</h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
                  Try changing your search or filters. New books will
                  appear here as readers list them.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Refine
                </p>

                <h2 className="mt-1 text-2xl">Filters</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-full bg-[var(--cream)] p-2"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                Category
              </p>

              <div className="flex flex-wrap gap-2">
                {availableCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold ${
                      category === item
                        ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                        : 'border-[var(--border)] bg-white text-[var(--ink-soft)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Availability
                </p>

                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm"
                >
                  <option>All</option>
                  <option>Available</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  Sort
                </p>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Price low</option>
                  <option>Price high</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 rounded-xl border border-[var(--border)] py-3.5 text-sm font-bold text-[var(--navy)]"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-[var(--navy)] py-3.5 text-sm font-bold text-white"
              >
                Show books
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}