
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
  isDemo?: boolean;
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

/*
 * Sample catalogue:
 * These books fill the Explore page when your database
 * contains fewer than 32 books.
 *
 * Add them to PostgreSQL later if you want them to be
 * available for actual rental requests.
 */
const sampleBooks: Book[] = [
  {
    id: 'sample-atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self Development',
    dailyRate: 80,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    dailyRate: 60,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-ikigai',
    title: 'Ikigai',
    author: 'Héctor García',
    category: 'Self Development',
    dailyRate: 70,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-psychology-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance',
    dailyRate: 90,
    rating: 4.9,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-rich-dad',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Finance',
    dailyRate: 75,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Self Development',
    dailyRate: 85,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-power',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    category: 'Business',
    dailyRate: 100,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140280197-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-think-grow',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Business',
    dailyRate: 65,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-seven-habits',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    category: 'Self Development',
    dailyRate: 90,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781982137274-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-subtle-art',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    category: 'Self Development',
    dailyRate: 80,
    rating: 4.4,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-alchemist-other',
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    category: 'Fiction',
    dailyRate: 70,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-harry-potter',
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    category: 'Fiction',
    dailyRate: 85,
    rating: 4.9,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-hobbit',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fiction',
    dailyRate: 75,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-pride',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Fiction',
    dailyRate: 55,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-animal-farm',
    title: 'Animal Farm',
    author: 'George Orwell',
    category: 'Fiction',
    dailyRate: 50,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-1984',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    dailyRate: 65,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    dailyRate: 120,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-pragmatic',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    category: 'Technology',
    dailyRate: 110,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-javascript',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    category: 'Technology',
    dailyRate: 100,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-python',
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    category: 'Technology',
    dailyRate: 100,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-steve-jobs',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'Biography',
    dailyRate: 95,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-wings-fire',
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    category: 'Biography',
    dailyRate: 65,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-long-walk',
    title: 'Long Walk to Freedom',
    author: 'Nelson Mandela',
    category: 'Biography',
    dailyRate: 90,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780316548182-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    dailyRate: 95,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-zero-one',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    dailyRate: 85,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-start-with-why',
    title: 'Start with Why',
    author: 'Simon Sinek',
    category: 'Business',
    dailyRate: 80,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-millionaire',
    title: 'The Millionaire Next Door',
    author: 'Thomas J. Stanley',
    category: 'Finance',
    dailyRate: 85,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781589795471-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-intelligent-investor',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'Finance',
    dailyRate: 110,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-thousand-suns',
    title: 'A Thousand Splendid Suns',
    author: 'Khaled Hosseini',
    category: 'Fiction',
    dailyRate: 75,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781594483851-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-little-prince',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'Fiction',
    dailyRate: 55,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-mindset',
    title: 'Mindset',
    author: 'Carol S. Dweck',
    category: 'Self Development',
    dailyRate: 75,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-power-of-now',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    category: 'Self Development',
    dailyRate: 80,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg',
    isDemo: true,
  },
  {
    id: 'sample-design-patterns',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    category: 'Technology',
    dailyRate: 130,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg',
    isDemo: true,
  },
];

const categories = [
  'All',
  'Business',
  'Self Development',
  'Fiction',
  'Technology',
  'Biography',
  'Finance',
  'Lifestyle',
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

  if (response.data && !Array.isArray(response.data)) {
    if (Array.isArray(response.data.books)) {
      return response.data.books;
    }

    if (Array.isArray(response.data.items)) {
      return response.data.items;
    }
  }

  return [];
}

function buildCatalogue(apiBooks: Book[]): Book[] {
  const realBooks = apiBooks.map((book) => ({
    ...book,
    isDemo: false,
  }));

  const existingTitles = new Set(
    realBooks.map((book) => book.title.trim().toLowerCase()),
  );

  const additionalBooks = sampleBooks.filter(
    (book) => !existingTitles.has(book.title.trim().toLowerCase()),
  );

  // Always show at least 32 books where enough samples are available.
  return [
    ...realBooks,
    ...additionalBooks.slice(
      0,
      Math.max(0, 32 - realBooks.length),
    ),
  ];
}

function formatPrice(value: number) {
  return `LKR ${Number(value || 0).toLocaleString()}/day`;
}

function BookCover({ book }: { book: Book }) {
  const [imageError, setImageError] = useState(false);

  const colours = [
    'from-[#244d3a] to-[#102b20]',
    'from-[#9b7044] to-[#59391f]',
    'from-[#45636c] to-[#203b43]',
    'from-[#8a5545] to-[#4c2b28]',
    'from-[#6d6244] to-[#39351f]',
  ];

  const colourIndex =
    Math.abs(
      book.title.split('').reduce((total, character) => {
        return total + character.charCodeAt(0);
      }, 0),
    ) % colours.length;

  return (
    <div className="relative flex h-[245px] w-full items-center justify-center overflow-hidden bg-[#eee4d5] p-4 sm:h-[290px]">
      {book.coverImage && !imageError ? (
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full max-w-full rounded-md object-contain shadow-[0_12px_22px_rgba(24,36,28,0.25)] transition duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className={`flex h-full w-[78%] flex-col items-center justify-between rounded-sm bg-gradient-to-br ${colours[colourIndex]} p-4 text-center text-white shadow-xl`}
        >
          <span className="w-full border-t border-white/40 pt-2 text-[8px] uppercase tracking-[0.2em] text-white/75">
            BookLoop Collection
          </span>

          <div className="px-1">
            <BookOpen
              size={27}
              strokeWidth={1.4}
              className="mx-auto mb-4 text-[#e6c38c]"
            />
            <h3 className="font-serif text-lg font-bold leading-tight sm:text-xl">
              {book.title}
            </h3>
          </div>

          <p className="text-[10px] font-medium text-white/80">
            {book.author}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ExploreClient() {
  const [books, setBooks] = useState<Book[]>([]);
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

        if (!mounted) return;

        const apiBooks = extractBooks(response);
        setBooks(buildCatalogue(apiBooks));
      } catch (err) {
        if (!mounted) return;

        // Keep the Explore page useful even when the API is unavailable.
        setBooks(buildCatalogue([]));

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to connect to the BookLoop server.',
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

    return [
      'All',
      ...uniqueCategories.filter((item) => item !== 'All'),
    ];
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
    <main className="min-h-screen bg-[#faf3e8] pb-24 text-[#182e23] md:pb-10">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))] pt-7 md:pt-10">
        {/* PAGE HEADER */}
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a8752e]">
            BookLoop Library
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-[#162e22] md:text-5xl">
                Explore Books
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c594f]">
                Discover your next favourite book from the BookLoop
                reading community.
              </p>
            </div>

            <div className="w-fit rounded-full bg-[#f0e2cc] px-4 py-2 text-sm font-semibold text-[#1a3928]">
              {books.length} books in the catalogue
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-7 flex gap-3">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#827969]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author or category..."
              className="w-full rounded-2xl border border-[#e5d8c5] bg-white py-3.5 pl-11 pr-4 text-sm text-[#182e23] outline-none transition placeholder:text-[#8b8479] focus:border-[#1a3928]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-2xl border border-[#e5d8c5] bg-white px-4 text-sm font-bold text-[#1a3928] md:hidden"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* API NOTICE */}
        {!loading && error && (
          <div className="mb-6 rounded-xl border border-[#e8d4b5] bg-[#f5e8d3] px-4 py-3 text-sm text-[#654c2e]">
            The server could not load your database listings. Showing
            sample books instead. Start your backend to load real listings.
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* DESKTOP FILTERS */}
          <aside className="hidden md:block">
            <div className="sticky top-6 rounded-2xl border border-[#e8dccb] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={17} />
                  <h2 className="text-sm font-bold text-[#182e23]">
                    Filters
                  </h2>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[#a8752e]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#827969]">
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
                          ? 'bg-[#f2e6d3] font-bold text-[#1a3928]'
                          : 'text-[#5c594f] hover:bg-[#faf3e8]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#827969]">
                  Availability
                </p>

                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e5d8c5] bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Available</option>
                </select>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#827969]">
                  Sort by
                </p>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full rounded-xl border border-[#e5d8c5] bg-white px-3 py-2.5 text-sm outline-none"
                >
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Price low</option>
                  <option>Price high</option>
                </select>
              </div>
            </div>
          </aside>

          {/* BOOK RESULTS */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-[#5c594f]">
                {loading
                  ? 'Loading books...'
                  : `Showing ${filteredBooks.length} ${
                      filteredBooks.length === 1 ? 'book' : 'books'
                    }`}
              </p>

              <div className="relative hidden sm:block md:hidden">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none rounded-xl border border-[#e5d8c5] bg-white py-2 pl-3 pr-9 text-xs font-semibold outline-none"
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

            {/* LOADING SKELETONS */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-[#e8dccb] bg-white"
                  >
                    <div className="h-[245px] animate-pulse bg-[#eee4d5] sm:h-[290px]" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 animate-pulse rounded bg-[#eee4d5]" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-[#eee4d5]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[#eee4d5]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BOOK GRID */}
            {!loading && filteredBooks.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {filteredBooks.map((book) => {
                  const isAvailable =
                    !book.status ||
                    book.status.toUpperCase() === 'AVAILABLE';

                  const cardContent = (
                    <>
                      <div className="relative">
                        <BookCover book={book} />

                        {book.isDemo && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold text-[#75552d] shadow-sm">
                            SAMPLE
                          </span>
                        )}
                      </div>

                      <div className="p-3.5 sm:p-4">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#f2e6d3] px-2.5 py-1 text-[10px] font-bold text-[#1a3928]">
                            {book.category || 'Book'}
                          </span>

                          <span
                            className={`text-[10px] font-bold ${
                              isAvailable
                                ? 'text-[#287447]'
                                : 'text-[#a34a3c]'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>

                        <h2 className="line-clamp-2 min-h-[40px] text-sm font-bold text-[#162e22] sm:text-[15px]">
                          {book.title}
                        </h2>

                        <p className="mt-1 truncate text-xs text-[#777064]">
                          {book.author}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#1a3928] sm:text-sm">
                            {formatPrice(book.dailyRate)}
                          </p>

                          {book.rating !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#5d5548]">
                              <Star
                                size={13}
                                className="fill-[#c79543] text-[#c79543]"
                              />
                              {Number(book.rating).toFixed(1)}
                            </div>
                          )}
                        </div>

                        {book.isDemo ? (
                          <div className="mt-3 rounded-full border border-[#d9c8ad] bg-[#f8f0e4] py-2.5 text-center text-xs font-bold text-[#75552d]">
                            Sample listing
                          </div>
                        ) : (
                          <div className="mt-3 rounded-full bg-[#1a3928] py-2.5 text-center text-xs font-bold text-white transition group-hover:bg-[#274e38]">
                            View Book
                          </div>
                        )}
                      </div>
                    </>
                  );

                  return book.isDemo ? (
                    <article
                      key={book.id}
                      className="group overflow-hidden rounded-2xl border border-[#e8dccb] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {cardContent}
                    </article>
                  ) : (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="group overflow-hidden rounded-2xl border border-[#e8dccb] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {cardContent}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* NO RESULTS */}
            {!loading && filteredBooks.length === 0 && (
              <div className="rounded-2xl border border-[#e8dccb] bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e6d3]">
                  <BookOpen size={25} className="text-[#1a3928]" />
                </div>

                <h2 className="font-serif text-2xl font-bold text-[#162e22]">
                  No books found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777064]">
                  Try changing your search or filters to discover more books.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#1a3928] px-6 py-3 text-sm font-bold text-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MOBILE FILTER SHEET */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#a8752e]">
                  Refine
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#162e22]">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
                className="rounded-full bg-[#f2e6d3] p-2 text-[#1a3928]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#827969]">
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
                        ? 'border-[#1a3928] bg-[#1a3928] text-white'
                        : 'border-[#e5d8c5] bg-white text-[#5c594f]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#827969]">
                  Availability
                </p>

                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value)
                  }
                  className="w-full rounded-xl border border-[#e5d8c5] bg-white px-3 py-3 text-sm text-[#182e23]"
                >
                  <option>All</option>
                  <option>Available</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#827969]">
                  Sort
                </p>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full rounded-xl border border-[#e5d8c5] bg-white px-3 py-3 text-sm text-[#182e23]"
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
                className="flex-1 rounded-xl border border-[#e5d8c5] py-3.5 text-sm font-bold text-[#1a3928]"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-[#1a3928] py-3.5 text-sm font-bold text-white"
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
