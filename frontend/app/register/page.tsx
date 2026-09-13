'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--offwhite)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="hidden bg-[var(--navy)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]">
              <BookOpen size={22} />
            </div>

            <div>
              <p className="font-serif text-2xl">BookLoop</p>
              <p className="text-xs text-white/60">Borrow. Lend. Read.</p>
            </div>
          </Link>

          <div className="max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Join the community
            </p>

            <h1 className="text-5xl leading-tight text-white">
              Share more books. Discover more stories.
            </h1>

            <p className="mt-6 text-base leading-7 text-white/65">
              Create your BookLoop account and become part of a trusted
              community of readers and book owners.
            </p>
          </div>

          <p className="text-xs text-white/40">
            Read more. Waste less. Share knowledge.
          </p>
        </section>

        {/* Register */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] lg:hidden"
            >
              <ArrowLeft size={16} />
              Back to BookLoop
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--navy)] text-white lg:hidden">
                <BookOpen size={23} />
              </div>

              <p className="mb-2 text-sm font-semibold text-[var(--gold)]">
                Start your journey
              </p>

              <h1 className="text-4xl">Create your account</h1>

              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                Join BookLoop and start borrowing or lending books.
              </p>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--navy)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[var(--navy)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-12 text-sm outline-none focus:border-[var(--navy)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  Use at least 8 characters.
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs leading-5 text-[var(--ink-soft)]">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--navy)]"
                />
                <span>
                  I agree to the BookLoop terms and understand the community
                  safety rules.
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--navy)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--navy-2)]"
              >
                Create account
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[var(--ink-soft)]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[var(--navy)] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}