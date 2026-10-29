
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { BookOpen, Eye, EyeOff, X } from 'lucide-react';
import { getAccessToken, login, register } from '../../../lib/auth';

type AuthModalProps = {
  open: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({
  open,
  initialMode = 'login',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    setMode(initialMode);
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, initialMode, onClose]);

  if (!open) return null;

  function switchMode(nextMode: 'login' | 'register') {
    setMode(nextMode);
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const cleanEmail = email.trim();

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Your passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        await register(name.trim(), cleanEmail, password);

        setPassword('');
        setConfirmPassword('');
        setMode('login');
        setMessage(
          'Your account was created. Please sign in with your new account.',
        );
      } else {
        await login(cleanEmail, password);

        if (!getAccessToken()) {
          throw new Error(
            'Login did not return an access token. Please check the backend authentication response.',
          );
        }

        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17273f]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative my-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#e3d8c0] bg-[#fbf7ef] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication popup"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#17273f] transition hover:bg-[#f0e6d2] disabled:opacity-50"
        >
          <X size={19} />
        </button>

        <div className="px-6 pb-7 pt-8 sm:px-9 sm:pt-9">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17273f] text-white shadow-md">
            <BookOpen size={24} />
          </div>

          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8862f]">
            Borrow. Lend. Read.
          </p>

          <h2
            id="auth-modal-title"
            className="mt-2 text-center font-serif text-3xl font-semibold text-[#17273f]"
          >
            {mode === 'login' ? 'Welcome back' : 'Join BookLoop'}
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-[#5b6673]">
            {mode === 'login'
              ? 'Your next chapter starts here.'
              : 'Create an account and share the joy of reading.'}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#f0e6d2] p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-lg py-2.5 text-sm font-bold transition ${
                mode === 'login'
                  ? 'bg-white text-[#17273f] shadow-sm'
                  : 'text-[#5b6673] hover:text-[#17273f]'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`rounded-lg py-2.5 text-sm font-bold transition ${
                mode === 'register'
                  ? 'bg-white text-[#17273f] shadow-sm'
                  : 'text-[#5b6673] hover:text-[#17273f]'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Full name
                </label>
                <input
                  id="auth-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm text-[#17273f] outline-none transition placeholder:text-[#9aa3ae] focus:border-[#b8862f] focus:ring-2 focus:ring-[#b8862f]/15"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-bold text-[#17273f]"
              >
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm text-[#17273f] outline-none transition placeholder:text-[#9aa3ae] focus:border-[#b8862f] focus:ring-2 focus:ring-[#b8862f]/15"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-bold text-[#17273f]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    mode === 'login'
                      ? 'Enter your password'
                      : 'At least 8 characters'
                  }
                  minLength={mode === 'register' ? 8 : undefined}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 pr-12 text-sm text-[#17273f] outline-none transition placeholder:text-[#9aa3ae] focus:border-[#b8862f] focus:ring-2 focus:ring-[#b8862f]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b6673] hover:text-[#17273f]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="mb-1.5 block text-xs font-bold text-[#17273f]"
                >
                  Confirm password
                </label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm text-[#17273f] outline-none transition placeholder:text-[#9aa3ae] focus:border-[#b8862f] focus:ring-2 focus:ring-[#b8862f]/15"
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-xl border border-[#cbdccf] bg-[#e4efe7] px-3 py-2.5 text-xs leading-5 text-[#315f43]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17273f] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,39,63,0.7)] transition hover:bg-[#213a56] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in to BookLoop'
                  : 'Create my account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#5b6673]">
            {mode === 'login'
              ? "New to BookLoop? "
              : 'Already have an account? '}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === 'login' ? 'register' : 'login')
              }
              className="font-bold text-[#b8862f] underline-offset-4 hover:underline"
            >
              {mode === 'login' ? 'Join the community' : 'Login instead'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
