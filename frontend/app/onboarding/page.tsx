'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Discover books',
    description:
      'Explore books shared by readers around you and find your next favourite story.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Borrow or lend',
    description:
      'Borrow books affordably or list books from your own collection for other readers.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Read with confidence',
    description:
      'BookLoop keeps rentals organised with deposits, condition checks and community trust.',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <main className="min-h-screen bg-[var(--offwhite)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10 lg:py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--navy)] text-white">
              <BookOpen size={20} />
            </div>

            <div>
              <p className="font-serif text-xl text-[var(--navy)]">BookLoop</p>
              <p className="text-[10px] text-[var(--ink-muted)]">
                Borrow. Lend. Read.
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-sm font-bold text-[var(--navy)]"
          >
            Skip
          </Link>
        </header>

        {/* Desktop layout */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="grid w-full max-w-5xl grid-cols-2 items-center gap-20">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                How BookLoop works
              </p>

              <h1 className="max-w-xl text-6xl leading-[1.05]">
                A better way to share the books you love.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-[var(--ink-soft)]">
                BookLoop connects readers and book owners so physical books
                can keep moving from one reader to another.
              </p>

              <div className="mt-10 flex gap-3">
                {steps.map((item, index) => (
                  <button
                    key={item.number}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-12 bg-[var(--navy)]'
                        : 'w-6 bg-[var(--cream-2)]'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-[var(--navy)] p-10 text-white">
              <div className="mb-12 flex items-center justify-between">
                <span className="text-sm font-bold text-white/45">
                  {step.number}
                </span>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gold)]">
                  <Icon size={30} />
                </div>
              </div>

              <h2 className="text-4xl text-white">{step.title}</h2>

              <p className="mt-5 text-base leading-7 text-white/65">
                {step.description}
              </p>

              <div className="mt-12 flex items-center justify-between">
                <span className="text-sm text-white/40">
                  {currentStep + 1} of {steps.length}
                </span>

                {isLast ? (
                  <Link
                    href="/register"
                    className="bl-button bg-[var(--gold)] text-[var(--navy)]"
                  >
                    Get started
                    <ArrowRight size={17} />
                  </Link>
                ) : (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bl-button bg-white text-[var(--navy)]"
                  >
                    Next
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-1 flex-col justify-center lg:hidden">
          <div className="mb-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              {step.number} / 03
            </p>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--navy)] text-white">
              <Icon size={34} />
            </div>
          </div>

          <h1 className="text-5xl leading-[1.08]">{step.title}</h1>

          <p className="mt-6 text-base leading-7 text-[var(--ink-soft)]">
            {step.description}
          </p>

          <div className="mt-10 flex gap-2">
            {steps.map((item, index) => (
              <button
                key={item.number}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-10 bg-[var(--navy)]'
                    : 'w-5 bg-[var(--cream-2)]'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-10">
            {isLast ? (
              <Link
                href="/register"
                className="bl-button bl-button-primary w-full py-4"
              >
                Create your account
                <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bl-button bl-button-primary w-full py-4"
              >
                Continue
                <ArrowRight size={17} />
              </button>
            )}

            <Link
              href="/login"
              className="mt-5 block text-center text-sm font-semibold text-[var(--ink-soft)]"
            >
              Already have an account?{' '}
              <span className="text-[var(--navy)]">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}