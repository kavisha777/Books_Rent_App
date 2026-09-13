'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  rate: number;
  rating: number;
  reviews: number;
  available: boolean;
  coverClass: string;
};

const books: Book[] = [
  {
    id: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    rate: 150,
    rating: 4.8,
    reviews: 124,
    available: true,
    coverClass: 'cover-one',
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    rate: 120,
    rating: 4.9,
    reviews: 218,
    available: true,
    coverClass: 'cover-two',
  },
  {
    id: 3,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    rate: 100,
    rating: 4.7,
    reviews: 187,
    available: true,
    coverClass: 'cover-three',
  },
  {
    id: 4,
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    category: 'Finance',
    rate: 130,
    rating: 4.6,
    reviews: 96,
    available: false,
    coverClass: 'cover-four',
  },
  {
    id: 5,
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity',
    rate: 140,
    rating: 4.8,
    reviews: 143,
    available: true,
    coverClass: 'cover-one',
  },
  {
    id: 6,
    title: 'Ikigai',
    author: 'Héctor García',
    category: 'Self Development',
    rate: 110,
    rating: 4.5,
    reviews: 82,
    available: true,
    coverClass: 'cover-three',
  },
  {
    id: 7,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    rate: 180,
    rating: 4.9,
    reviews: 76,
    available: true,
    coverClass: 'cover-two',
  },
  {
    id: 8,
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    category: 'Thriller',
    rate: 125,
    rating: 4.7,
    reviews: 109,
    available: true,
    coverClass: 'cover-four',
  },
  {
    id: 9,
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Finance',
    rate: 105,
    rating: 4.4,
    reviews: 64,
    available: true,
    coverClass: 'cover-two',
  },
];

const categories = [
  'All',
  'Fiction',
  'Technology',
  'Finance',
  'Self Development',
  'Productivity',
  'Thriller',
];

export default function ExploreClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('Recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All' || book.category === category;

      const matchesAvailability =
        !availableOnly || book.available;

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    if (sort === 'Price: Low to High') {
      return [...result].sort((a, b) => a.rate - b.rate);
    }

    if (sort === 'Price: High to Low') {
      return [...result].sort((a, b) => b.rate - a.rate);
    }

    if (sort === 'Rating') {
      return [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, availableOnly, sort]);

  return (
    <main className="min-h-screen pb-8">
      <section className="border-b border-[#e3d8c0] bg-[#fbf7ef]">
        <div className="bl-container py-8 md:py-10">
          <div className="mb-7">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#b8862f]">
              Discover your next read
            </p>

            <h1 className="text-4xl md:text-5xl">
              Explore the catalogue
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5b6673] md:text-base">
              Find books from readers around you. Borrow for a few days,
              enjoy the story, and return it when you are done.
            </p>
          </div>

          <div className="relative max-w-3xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa3ae]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author or category..."
              className="h-14 w-full rounded-2xl border border-[#e3d8c0] bg-white pl-12 pr-12 text-sm text-[#1e2a38] outline-none transition focus:border-[#b8862f] focus:ring-4 focus:ring-[#f3e4c4]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#9aa3ae] hover:bg-[#f0e6d2] hover:text-[#17273f]"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? 'bg-[#17273f] text-white'
                    : 'border border-[#e3d8c0] bg-white text-[#5b6673] hover:border-[#b8862f] hover:text-[#17273f]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bl-container py-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#17273f]">
              {filteredBooks.length} books found
            </p>
            <p className="mt-1 text-xs text-[#9aa3ae]">
              Borrow from independent book owners
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#e3d8c0] bg-white px-4 py-2.5 text-xs font-bold text-[#17273f] md:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[210px_1fr]">
          <aside className="hidden md:block">
            <FilterPanel
              category={category}
              setCategory={setCategory}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              sort={sort}
              setSort={setSort}
            />
          </aside>

          <div>
            {filteredBooks.length === 0 ? (
              <EmptyState
                onClear={() => {
                  setSearch('');
                  setCategory('All');
                  setAvailableOnly(false);
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-[#17273f]/50"
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#fbf7ef] p-5 shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#e3d8c0]" />

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl">Filters</h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full bg-[#f0e6d2] p-2 text-[#17273f]"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <FilterPanel
              category={category}
              setCategory={setCategory}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              sort={sort}
              setSort={setSort}
            />

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="bl-button bl-button-primary mt-6 w-full"
            >
              Show {filteredBooks.length} books
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function FilterPanel({
  category,
  setCategory,
  availableOnly,
  setAvailableOnly,
  sort,
  setSort,
}: {
  category: string;
  setCategory: (value: string) => void;
  availableOnly: boolean;
  setAvailableOnly: (value: boolean) => void;
  sort: string;
  setSort: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#e3d8c0] bg-white p-4">
      <div className="mb-5 flex items-center gap-2">
        <Filter size={16} className="text-[#b8862f]" />
        <h3 className="font-sans text-sm font-extrabold text-[#17273f]">
          Filters
        </h3>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#9aa3ae]">
          Category
        </p>

        <div className="space-y-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                category === item
                  ? 'bg-[#f3e4c4] text-[#17273f]'
                  : 'text-[#5b6673] hover:bg-[#fbf7ef] hover:text-[#17273f]'
              }`}
            >
              {item}
              {category === item && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#9aa3ae]">
          Availability
        </p>

        <label className="flex cursor-pointer items-center gap-3 text-xs font-semibold text-[#5b6673]">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
            className="h-4 w-4 accent-[#17273f]"
          />
          Available books only
        </label>
      </div>

      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#9aa3ae]">
          Sort by
        </p>

        <div className="relative">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full appearance-none rounded-xl border border-[#e3d8c0] bg-[#fbf7ef] px-3 py-2.5 pr-8 text-xs font-semibold text-[#17273f] outline-none focus:border-[#b8862f]"
          >
            <option>Recommended</option>
            <option>Rating</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3ae]"
          />
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e3d8c0] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className={`book-cover ${book.coverClass} aspect-[4/5]`}>
        <div className="absolute left-3 top-3 z-10">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
              book.available
                ? 'bg-[#e4efe7] text-[#3f7a57]'
                : 'bg-[#f6e4e0] text-[#b14a3d]'
            }`}
          >
            {book.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="book-cover-content p-4">
          <BookOpen size={18} className="mb-2 opacity-80" />
          <p className="line-clamp-2 text-sm font-extrabold leading-5">
            {book.title}
          </p>
          <p className="mt-1 text-[10px] opacity-80">{book.author}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#b8862f]">
          {book.category}
        </p>

        <h3 className="line-clamp-2 text-base leading-5">{book.title}</h3>

        <p className="mt-1 text-xs text-[#5b6673]">{book.author}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <span className="text-sm font-extrabold text-[#17273f]">
              Rs. {book.rate}
            </span>
            <span className="text-[10px] text-[#9aa3ae]"> / day</span>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-[#17273f]">
              ★ {book.rating}
            </p>
            <p className="text-[10px] text-[#9aa3ae]">
              {book.reviews} reviews
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!book.available}
          className={`mt-4 w-full rounded-xl py-2.5 text-xs font-extrabold transition ${
            book.available
              ? 'bg-[#17273f] text-white hover:bg-[#213a56]'
              : 'cursor-not-allowed bg-[#f0e6d2] text-[#9aa3ae]'
          }`}
        >
          {book.available ? 'View book' : 'Currently unavailable'}
        </button>
      </div>
    </article>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#e3d8c0] bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e4c4] text-[#b8862f]">
        <Search size={24} />
      </div>

      <h2 className="text-2xl">No books found</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5b6673]">
        Try another search term or remove some filters to discover more
        books.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="bl-button bl-button-primary mt-5"
      >
        Clear filters
      </button>
    </div>
  );
}