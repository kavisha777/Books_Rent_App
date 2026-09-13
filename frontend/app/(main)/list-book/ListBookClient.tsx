'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Upload,
} from 'lucide-react';

const categories = [
  'Fiction',
  'Self Development',
  'Business',
  'Technology',
  'Science',
  'Biography',
  'Education',
  'Other',
];

const conditions = [
  {
    value: 'GOOD',
    label: 'Good',
    description: 'Minor signs of use',
  },
  {
    value: 'VERY_GOOD',
    label: 'Very Good',
    description: 'Well maintained',
  },
  {
    value: 'LIKE_NEW',
    label: 'Like New',
    description: 'Almost no visible wear',
  },
];

export default function ListBookClient() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('GOOD');
  const [submitted, setSubmitted] = useState(false);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Backend integration will be added later.
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef]">
      {/* Header */}
      <header className="border-b border-[#e3d8c0] bg-[#fbf7ef]">
        <div className="bl-container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#17273f]"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <BookOpen size={21} className="text-[#b8862f]" />
            <span className="font-semibold text-[#17273f]">List a Book</span>
          </div>

          <div className="w-[52px]" />
        </div>
      </header>

      <div className="bl-container py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Intro */}
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b8862f]">
              Share your shelf
            </p>

            <h1 className="text-3xl leading-tight md:text-5xl">
              Give your books another reader.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#5b6673] md:text-base">
              List a book on BookLoop and earn while helping someone nearby
              discover their next great read.
            </p>
          </div>

          {submitted ? (
            <SuccessState />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Main form */}
                <div className="space-y-6">
                  {/* Basic information */}
                  <section className="bl-card p-5 md:p-7">
                    <div className="mb-6">
                      <h2 className="text-xl">Book information</h2>
                      <p className="mt-1 text-sm text-[#5b6673]">
                        Tell borrowers about the book you are offering.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <FormField
                        label="Book title"
                        required
                        placeholder="e.g. The Psychology of Money"
                        name="title"
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                          label="Author"
                          required
                          placeholder="e.g. Morgan Housel"
                          name="author"
                        />

                        <FormField
                          label="ISBN"
                          placeholder="e.g. 9780857197689"
                          name="isbn"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
                          Category <span className="text-[#b14a3d]">*</span>
                        </label>

                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          required
                          className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm text-[#1e2a38] outline-none transition focus:border-[#2c4c6e] focus:ring-2 focus:ring-[#2c4c6e]/10"
                        >
                          <option value="">Select a category</option>

                          {categories.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
                          Description
                        </label>

                        <textarea
                          name="description"
                          rows={5}
                          placeholder="Add a short description about the book, its edition, or anything a borrower should know..."
                          className="w-full resize-none rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm leading-6 text-[#1e2a38] outline-none transition placeholder:text-[#9aa3ae] focus:border-[#2c4c6e] focus:ring-2 focus:ring-[#2c4c6e]/10"
                        />

                        <p className="mt-2 text-xs text-[#9aa3ae]">
                          Avoid sharing private contact information here.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Cover */}
                  <section className="bl-card p-5 md:p-7">
                    <div className="mb-6">
                      <h2 className="text-xl">Book cover</h2>
                      <p className="mt-1 text-sm text-[#5b6673]">
                        Add a clear image so borrowers can recognise the book.
                      </p>
                    </div>

                    <label
                      htmlFor="cover-upload"
                      className={`relative flex min-h-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                        coverPreview
                          ? 'border-[#e3d8c0] bg-[#f0e6d2]'
                          : 'border-[#e3d8c0] bg-[#fbf7ef] hover:border-[#b8862f] hover:bg-[#f0e6d2]/60'
                      }`}
                    >
                      {coverPreview ? (
                        <>
                          <img
                            src={coverPreview}
                            alt="Book cover preview"
                            className="h-64 w-full object-contain"
                          />

                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#17273f] px-4 py-2 text-xs font-semibold text-white">
                            Change cover
                          </div>
                        </>
                      ) : (
                        <div className="px-6 text-center">
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e4c4] text-[#b8862f]">
                            <ImagePlus size={26} />
                          </div>

                          <p className="text-sm font-bold text-[#17273f]">
                            Upload a book cover
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#5b6673]">
                            PNG or JPG · Clear front cover recommended
                          </p>

                          <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#17273f] px-4 py-2 text-xs font-bold text-white">
                            <Upload size={14} />
                            Choose image
                          </span>
                        </div>
                      )}

                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </section>

                  {/* Condition */}
                  <section className="bl-card p-5 md:p-7">
                    <div className="mb-6">
                      <h2 className="text-xl">Book condition</h2>
                      <p className="mt-1 text-sm text-[#5b6673]">
                        Be honest about the current condition of your copy.
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {conditions.map((item) => {
                        const selected = condition === item.value;

                        return (
                          <button
                            type="button"
                            key={item.value}
                            onClick={() => setCondition(item.value)}
                            className={`relative rounded-2xl border p-4 text-left transition ${
                              selected
                                ? 'border-[#17273f] bg-[#f0e6d2]'
                                : 'border-[#e3d8c0] bg-white hover:border-[#b8862f]'
                            }`}
                          >
                            {selected && (
                              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#17273f] text-white">
                                <Check size={12} />
                              </span>
                            )}

                            <p className="pr-6 text-sm font-bold text-[#17273f]">
                              {item.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#5b6673]">
                              {item.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Pricing */}
                  <section className="bl-card p-5 md:p-7">
                    <div className="mb-6">
                      <h2 className="text-xl">Rental pricing</h2>
                      <p className="mt-1 text-sm text-[#5b6673]">
                        Set a fair price and refundable security deposit.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
                          Daily rental price <span className="text-[#b14a3d]">*</span>
                        </label>

                        <div className="flex overflow-hidden rounded-xl border border-[#e3d8c0] bg-white focus-within:border-[#2c4c6e]">
                          <span className="flex items-center border-r border-[#e3d8c0] bg-[#fbf7ef] px-4 text-sm font-bold text-[#5b6673]">
                            Rs.
                          </span>

                          <input
                            name="dailyRate"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="150"
                            required
                            className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
                          Security deposit <span className="text-[#b14a3d]">*</span>
                        </label>

                        <div className="flex overflow-hidden rounded-xl border border-[#e3d8c0] bg-white focus-within:border-[#2c4c6e]">
                          <span className="flex items-center border-r border-[#e3d8c0] bg-[#fbf7ef] px-4 text-sm font-bold text-[#5b6673]">
                            Rs.
                          </span>

                          <input
                            name="securityDeposit"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="3000"
                            required
                            className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3 rounded-xl bg-[#f3e4c4]/60 p-4">
                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-[#b8862f]"
                      />

                      <p className="text-xs leading-5 text-[#5b6673]">
                        The security deposit is refundable after the book is
                        returned and its condition is verified. It is not an
                        additional rental fee.
                      </p>
                    </div>
                  </section>

                  {/* Location */}
                  <section className="bl-card p-5 md:p-7">
                    <div className="mb-6">
                      <h2 className="text-xl">Pickup location</h2>
                      <p className="mt-1 text-sm text-[#5b6673]">
                        Give borrowers a general idea of where the book can be
                        collected.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
                        Area / neighbourhood{' '}
                        <span className="text-[#b14a3d]">*</span>
                      </label>

                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa3ae]"
                        />

                        <input
                          name="location"
                          placeholder="e.g. Moratuwa, Colombo"
                          required
                          className="w-full rounded-xl border border-[#e3d8c0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#2c4c6e] focus:ring-2 focus:ring-[#2c4c6e]/10"
                        />
                      </div>

                      <p className="mt-2 text-xs text-[#9aa3ae]">
                        Your exact address should not be displayed publicly.
                      </p>
                    </div>
                  </section>
                </div>

                {/* Desktop side panel */}
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                  <div className="bl-card overflow-hidden">
                    <div className="bg-[#17273f] p-6 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f3e4c4]">
                        Before you publish
                      </p>

                      <h2 className="mt-2 text-2xl text-white">
                        Make your listing trustworthy.
                      </h2>
                    </div>

                    <div className="space-y-5 p-6">
                      <TrustItem
                        number="01"
                        title="Use accurate information"
                        text="Correct title, author, condition and pricing help avoid disputes."
                      />

                      <TrustItem
                        number="02"
                        title="Protect your privacy"
                        text="Share only a general pickup area, not your private address."
                      />

                      <TrustItem
                        number="03"
                        title="Set a fair deposit"
                        text="The deposit should reasonably reflect the value and condition of your book."
                      />

                      <TrustItem
                        number="04"
                        title="Keep evidence"
                        text="Clear photos of the book condition can help resolve future disputes."
                      />
                    </div>

                    <div className="border-t border-[#e3d8c0] bg-[#fbf7ef] p-6">
                      <button
                        type="submit"
                        className="bl-button bl-button-primary w-full"
                      >
                        Publish book
                      </button>

                      <p className="mt-3 text-center text-[11px] leading-4 text-[#9aa3ae]">
                        You can update your listing later from your profile.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Mobile submit */}
              <div className="mt-6 lg:hidden">
                <button
                  type="submit"
                  className="bl-button bl-button-primary w-full py-3.5"
                >
                  Publish book
                </button>

                <p className="mt-3 text-center text-xs text-[#9aa3ae]">
                  Your listing will be connected to the BookLoop backend later.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  required,
  placeholder,
  name,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  name: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1e2a38]">
        {label} {required && <span className="text-[#b14a3d]">*</span>}
      </label>

      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#e3d8c0] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9aa3ae] focus:border-[#2c4c6e] focus:ring-2 focus:ring-[#2c4c6e]/10"
      />
    </div>
  );
}

function TrustItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e4c4] text-[10px] font-extrabold text-[#b8862f]">
        {number}
      </div>

      <div>
        <p className="text-sm font-bold text-[#17273f]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#5b6673]">{text}</p>
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="bl-card mx-auto max-w-xl p-8 text-center md:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e4efe7] text-[#3f7a57]">
        <Check size={30} />
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#3f7a57]">
        Listing ready
      </p>

      <h2 className="mt-2 text-3xl">Your book is ready to be shared.</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5b6673]">
        The form is currently running with demo data. We will connect it to
        your BookLoop backend when frontend API integration begins.
      </p>

      <Link
        href="/explore"
        className="bl-button bl-button-primary mt-7"
      >
        Browse books
      </Link>
    </div>
  );
}