'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { login } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--offwhite)]">
      <div className="grid min-h-screen lg:grid-cols-2">
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
              Welcome back
            </p>

            <h1 className="text-5xl leading-tight text-white">
              Your next great read is waiting.
            </h1>

            <p className="mt-6 text-base leading-7 text-white/65">
              Discover books from people around you, borrow them for less,
              and share your own collection with fellow readers.
            </p>
          </div>

          <p className="text-xs text-white/40">
            A community built around books.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] lg:hidden"
            >
              <ArrowLeft size={16} />
              Back to BookLoop
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--navy)] text-white lg:hidden">
                <BookOpen size={23} />
              </div>

              <p className="mb-2 text-sm font-semibold text-[var(--gold)]">
                Welcome back
              </p>

              <h1 className="text-4xl">Sign in to BookLoop</h1>

              <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                Continue discovering, borrowing and lending books.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-[var(--red-soft)] bg-[var(--red-soft)] px-4 py-3 text-sm font-medium text-[var(--red)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--navy)]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--navy-3)]"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[var(--navy)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--navy)]"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[var(--navy)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--navy-2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--ink-muted)]">OR</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 text-sm font-bold text-[var(--navy)] transition hover:bg-[var(--cream)]"
            >
              Continue with Google
            </button>

            <p className="mt-7 text-center text-sm text-[var(--ink-soft)]">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-[var(--navy)] underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}