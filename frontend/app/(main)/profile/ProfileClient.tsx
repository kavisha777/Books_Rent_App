'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Edit3,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  User,
  X,
} from 'lucide-react';

const user = {
  name: 'Kavisha Perera',
  username: '@kavisha',
  location: 'Colombo, Sri Lanka',
  joined: 'September 2026',
  bio: 'Avid reader who loves discovering useful books and sharing them with other readers.',
  rating: 4.8,
  reviews: 12,
  booksListed: 6,
  rentalsCompleted: 8,
  activeRentals: 2,
};

const listedBooks = [
  {
    id: 'book-1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 180,
    available: true,
  },
  {
    id: 'book-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 150,
    available: true,
  },
  {
    id: 'book-3',
    title: 'Deep Work',
    author: 'Cal Newport',
    price: 160,
    available: false,
  },
];

const reviews = [
  {
    name: 'Sahan',
    rating: 5,
    text: 'Great lender. Communication was easy and the book was well maintained.',
    time: '1 week ago',
  },
  {
    name: 'Dinithi',
    rating: 5,
    text: 'Smooth handover and exactly as described. Would rent again.',
    time: '3 weeks ago',
  },
  {
    name: 'Ravindu',
    rating: 4,
    text: 'Good experience overall. The pickup arrangement was convenient.',
    time: '1 month ago',
  },
];

export default function ProfileClient() {
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setSaved(true);
    setShowEdit(false);
  }

  return (
    <main className="min-h-screen pb-10">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="bl-container flex min-h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--navy)] transition hover:bg-[var(--offwhite)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                Account
              </p>
              <h1 className="text-2xl sm:text-3xl">My Profile</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="bl-button bl-button-secondary hidden sm:inline-flex"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bl-container py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Profile sidebar */}
          <aside>
            <div className="bl-card overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[var(--navy)] via-[var(--navy-2)] to-[var(--navy-3)]" />

              <div className="-mt-12 px-5 pb-6">
                <div className="flex items-end justify-between">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[var(--cream)] text-3xl font-bold text-[var(--navy)] shadow-sm">
                    KP
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--navy)] shadow-sm sm:hidden"
                    aria-label="Edit profile"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <h2 className="text-3xl">{name}</h2>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {user.username}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)]">
                      <MapPin className="h-4 w-4 text-[var(--gold)]" />
                      {location}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--ink-soft)]">
                      <CalendarDays className="h-4 w-4 text-[var(--navy-3)]" />
                      Member since {user.joined}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-[var(--ink-soft)]">
                    {bio}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-[var(--offwhite)] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold-soft)]">
                      <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">
                        {user.rating} / 5
                      </p>
                      <p className="text-[11px] text-[var(--ink-soft)]">
                        Based on {user.reviews} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-[var(--green-soft)] bg-[var(--green-soft)] p-3">
                  <ShieldCheck className="h-4 w-4 text-[var(--green)]" />
                  <p className="text-xs font-semibold text-[var(--green)]">
                    Trusted BookLoop member
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            {/* Stats */}
            <section>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                  Your activity
                </p>
                <h2 className="mt-1 text-3xl">Reading & lending</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={BookOpen}
                  value={user.booksListed}
                  label="Books listed"
                />

                <StatCard
                  icon={Check}
                  value={user.rentalsCompleted}
                  label="Completed rentals"
                />

                <StatCard
                  icon={CalendarDays}
                  value={user.activeRentals}
                  label="Active rentals"
                />

                <StatCard
                  icon={Star}
                  value={user.rating}
                  label="Average rating"
                />
              </div>
            </section>

            {/* Listed books */}
            <section className="bl-card p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                    Your library
                  </p>
                  <h2 className="mt-1 text-2xl">Books you&apos;ve listed</h2>
                </div>

                <Link
                  href="/list-book"
                  className="hidden items-center gap-1 text-xs font-bold text-[var(--navy-3)] sm:flex"
                >
                  List another book
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {listedBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] p-3 transition hover:bg-[var(--offwhite)]"
                  >
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--navy-3)] to-[var(--navy)] text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-sans text-sm font-bold text-[var(--navy)]">
                          {book.title}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            book.available
                              ? 'bg-[var(--green-soft)] text-[var(--green)]'
                              : 'bg-[var(--cream)] text-[var(--ink-soft)]'
                          }`}
                        >
                          {book.available ? 'AVAILABLE' : 'RENTED'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[var(--ink-soft)]">
                        {book.author}
                      </p>

                      <p className="mt-2 text-xs font-bold text-[var(--gold)]">
                        LKR {book.price} / day
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-[var(--ink-muted)] transition group-hover:text-[var(--navy)]" />
                  </Link>
                ))}
              </div>

              <Link
                href="/list-book"
                className="bl-button bl-button-secondary mt-4 w-full sm:hidden"
              >
                List another book
              </Link>
            </section>

            {/* Reviews */}
            <section className="bl-card p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                    Community feedback
                  </p>
                  <h2 className="mt-1 text-2xl">Recent reviews</h2>
                </div>

                <div className="flex items-center gap-1 text-sm font-bold text-[var(--navy)]">
                  <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  {user.rating}
                </div>
              </div>

              <div className="mt-5 divide-y divide-[var(--border)]">
                {reviews.map((review) => (
                  <div key={review.name} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-xs font-bold text-[var(--navy)]">
                          {review.name.slice(0, 1)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[var(--navy)]">
                            {review.name}
                          </p>

                          <div className="mt-1 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= review.rating
                                    ? 'fill-[var(--gold)] text-[var(--gold)]'
                                    : 'text-[var(--cream-2)]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-[var(--ink-muted)]">
                        {review.time}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Settings links */}
            <section className="bl-card overflow-hidden">
              <div className="border-b border-[var(--border)] px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                  Account
                </p>
                <h2 className="mt-1 text-2xl">Settings & safety</h2>
              </div>

              <div>
                <SettingRow
                  icon={User}
                  title="Personal information"
                  description="Manage your profile details"
                />

                <SettingRow
                  icon={ShieldCheck}
                  title="Trust & safety"
                  description="Learn how BookLoop protects rentals"
                />

                <SettingRow
                  icon={Heart}
                  title="Saved books"
                  description="View books you have saved"
                />
              </div>
            </section>
          </section>
        </div>
      </div>

      {/* Edit profile modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(23,39,63,0.45)] p-0 sm:items-center sm:p-6">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--gold)]">
                  Account
                </p>
                <h2 className="mt-1 text-2xl">Edit profile</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--offwhite)] text-[var(--navy)]"
                aria-label="Close edit profile"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="text-xs font-bold text-[var(--navy)]"
                >
                  Name
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-location"
                  className="text-xs font-bold text-[var(--navy)]"
                >
                  Location
                </label>
                <input
                  id="profile-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="text-xs font-bold text-[var(--navy)]"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--navy)]"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="bl-button bl-button-secondary flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveProfile}
                className="bl-button bl-button-primary flex-1"
              >
                <Check className="h-4 w-4" />
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo saved message */}
      {saved && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[var(--navy)] px-5 py-3 text-xs font-bold text-white shadow-xl">
          Profile changes saved
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: number | string;
  label: string;
}) {
  return (
    <div className="bl-card p-4 sm:p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cream)]">
        <Icon className="h-4 w-4 text-[var(--navy-3)]" />
      </div>

      <p className="mt-4 text-2xl font-bold text-[var(--navy)]">{value}</p>
      <p className="mt-1 text-[11px] leading-4 text-[var(--ink-soft)]">
        {label}
      </p>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 border-b border-[var(--border)] p-4 text-left last:border-b-0 hover:bg-[var(--offwhite)] sm:p-5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cream)]">
        <Icon className="h-5 w-5 text-[var(--navy-3)]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[var(--navy)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">{description}</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-[var(--ink-muted)]" />
    </button>
  );
}