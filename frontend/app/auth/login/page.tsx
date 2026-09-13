'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="hidden bg-[#17273f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#17273f]">
              <BookOpen size={21} />
            </div>

            <div>
              <div className="font-serif text-xl font-semibold">
                BookLoop
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
                Borrow. Lend. Read.
              </div>
            </div>
          </Link>

          <div className="max-w-lg">
            <div className="mb-5 text-sm font-semibold text-[#e7dac0]">
              Welcome back
            </div>

            <h1 className="text-5xl leading-[1.05] text-white">
              Your next chapter starts here.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              Sign in to discover books, manage your rentals and share
              your own collection with the BookLoop community.
            </p>
          </div>

          <p className="text-xs text-white/40">
            Read more. Share more. Waste less.
          </p>
        </section>

        {/* Form panel */}
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[430px]">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17273f] text-white">
                  <BookOpen size={21} />
                </div>

                <div>
                  <div className="font-serif text-xl font-semibold text-[#17273f]">
                    BookLoop
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9aa3ae]">
                    Borrow. Lend. Read.
                  </div>
                </div>
              </Link>

              <Link
                href="/"
                aria-label="Back to home"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0e6d2] text-[#17273f]"
              >
                <ArrowLeft size={18} />
              </Link>
            </div>

            <div>
              <div className="mb-3 inline-flex rounded-full bg-[#f3e4c4] px-3 py-1.5 text-[11px] font-bold text-[#b8862f]">
                Welcome back
              </div>

              <h2 className="text-4xl">Sign in to BookLoop</h2>

              <p className="mt-3 text-sm leading-6 text-[#5b6673]">
                Continue your reading journey.
              </p>
            </div>

            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-[1.5px] border-[#e3d8c0] bg-white px-4 py-3.5 text-sm text-[#1e2a38] outline-none transition focus:border-[#17273f]"
                  required
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-[#17273f]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#b8862f] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border-[1.5px] border-[#e3d8c0] bg-white px-4 py-3.5 pr-12 text-sm text-[#1e2a38] outline-none transition focus:border-[#17273f]"
                    required
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#9aa3ae] hover:bg-[#f0e6d2] hover:text-[#17273f]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17273f] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#213a56]"
              >
                Sign in
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e3d8c0]" />
              <span className="text-[11px] font-semibold text-[#9aa3ae]">
                NEW TO BOOKLOOP?
              </span>
              <div className="h-px flex-1 bg-[#e3d8c0]" />
            </div>

            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-xl border-[1.5px] border-[#17273f] bg-transparent px-5 py-3.5 text-sm font-bold text-[#17273f] transition hover:bg-[#17273f]/5"
            >
              Create an account
            </Link>

            <p className="mt-8 text-center text-[11px] leading-5 text-[#9aa3ae]">
              By continuing, you agree to use BookLoop responsibly and
              respect other readers and book owners.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}