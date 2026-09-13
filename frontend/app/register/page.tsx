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
import { FormEvent, useState } from 'react';
import { register } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the BookLoop terms to continue.');
      return;
    }

    try {
      setLoading(true);

      await register(name.trim(), email.trim(), password);

      router.push('/onboarding');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.',
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

            {error && (
              <div className="mb-5 rounded-xl border border-[var(--red-soft)] bg-[var(--red-soft)] px-4 py-3 text-sm font-medium text-[var(--red)]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
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
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[var(--border)] bg-white py-3.5 pl-11 pr-12 text-sm outline-none focus:border-[var(--navy)]"
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

                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                  Use at least 8 characters.
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs leading-5 text-[var(--ink-soft)]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--navy)]"
                />

                <span>
                  I agree to the BookLoop terms and understand the community
                  safety rules.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[var(--navy)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--navy-2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
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