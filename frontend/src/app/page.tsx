```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <span className="text-2xl font-bold tracking-tight">
              BookLoop
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#browse"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Browse Books
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block">
              Login
            </button>

            <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <span>📖</span>
              <span>A smarter way to share books</span>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Rent a Book.
              <br />
              Share a Book.
              <br />
              <span className="text-slate-500">
                Keep Stories Moving.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover books from people around you and rent the books
              you want. Have books sitting on your shelf? Share them
              with others and earn from your collection.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-700">
                Browse Books →
              </button>

              <button className="rounded-xl border border-slate-300 px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50">
                List Your Book
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span>✓ Discover local books</span>
              <span>✓ Secure rentals</span>
              <span>✓ Build your reputation</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="rounded-3xl bg-slate-100 p-8 md:p-12">
              <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    BOOKLOOP
                  </span>
                  <span className="text-xl">🔖</span>
                </div>

                <div className="mt-8 rounded-xl bg-slate-900 p-8 text-center text-white">
                  <div className="text-6xl">📚</div>
                  <h2 className="mt-5 text-2xl font-bold">
                    Your next story
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Could be closer than you think.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      AVAILABLE NEAR YOU
                    </p>
                    <p className="mt-1 font-semibold">
                      Find your next book
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-t border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              How BookLoop Works
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              From discovering a book to returning it, BookLoop keeps
              the rental process simple and transparent.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                1
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Discover
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Search for books by title, author, ISBN, category,
                language, price and availability.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                2
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Rent
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Request a book, agree on the rental period and
                complete the secure rental process.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
                3
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Return
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Return the book, verify its condition and complete
                the rental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Have books collecting dust?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Give your books another journey. List them on BookLoop
            and let someone else discover their next favourite story.
          </p>

          <button className="mt-8 rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-200">
            Start Sharing →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 pb-8 text-center text-sm text-slate-400">
        © 2026 BookLoop. Share stories. Build connections.
      </footer>
    </main>
  );
}
```
