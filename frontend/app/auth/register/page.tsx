'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form panel */}
        <section className="order-2 flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:order-1">
          <div className="w-full max-w-[450px]">
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
                Join the community
              </div>

              <h2 className="text-4xl">Create your account</h2>

              <p className="mt-3 text-sm leading-6 text-[#5b6673]">
                Start borrowing and lending books with BookLoop.
              </p>
            </div>

            <form
              className="mt-7 space-y-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border-[1.5px] border-[#e3d8c0] bg-white px-4 py-3.5 text-sm text-[#1e2a38] outline-none transition focus:border-[#17273f]"
                  required
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full rounded-xl border-[1.5px] border-[#e3d8c0] bg-white px-4 py-3.5 pr-12 text-sm text-[#1e2a38] outline-none transition focus:border-[#17273f]"
                    required
                    minLength={8}
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

                <p className="mt-1.5 text-[10px] text-[#9aa3ae]">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border-[1.5px] border-[#e3d8c0] bg-white px-4 py-3.5 pr-12 text-sm text-[#1e2a38] outline-none transition focus:border-[#17273f]"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#9aa3ae] hover:bg-[#f0e6d2] hover:text-[#17273f]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 accent-[#17273f]"
                />

                <span className="text-[11px] leading-5 text-[#5b6673]">
                  I agree to use BookLoop responsibly and respect the
                  books and property of other members.
                </span>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17273f] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#213a56]"
              >
                Create account
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#5b6673]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#17273f] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Brand panel */}
        <section className="order-1 hidden bg-[#17273f] p-10 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5"
          >
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
              One account. Two ways to participate.
            </div>

            <h1 className="text-5xl leading-[1.05] text-white">
              Borrow a story. Share a story.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/65">
              On BookLoop, you can be both a borrower and a lender.
              Discover something new today, then give someone else a
              chance to discover your favourite book tomorrow.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-serif text-2xl text-[#e7dac0]">
                  01
                </div>
                <div className="mt-2 text-xs font-bold">
                  Discover
                </div>
                <div className="mt-1 text-[10px] leading-5 text-white/50">
                  Find books from your community.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-serif text-2xl text-[#e7dac0]">
                  02
                </div>
                <div className="mt-2 text-xs font-bold">
                  Share
                </div>
                <div className="mt-1 text-[10px] leading-5 text-white/50">
                  Earn from books on your shelf.
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            Read more. Share more. Waste less.
          </p>
        </section>
      </div>
    </main>
  );
}