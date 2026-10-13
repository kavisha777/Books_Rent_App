'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileWarning,
  Hand,
  Loader2,
  Play,
  ShieldAlert,
  Undo2,
  X,
} from 'lucide-react';

import { apiRequest } from '../../../../lib/api';
import {
  getRentalActions,
  getRentalWaitNote,
  type RentalAction,
  type RentalActionKind,
  type RentalRoles,
} from '../../../../lib/rental-actions';

export type RentalDisputeSummary = {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
};

type Props = {
  rentalId: string;
  status: string;
  roles: RentalRoles;
  payTotalLabel: string;
  disputes?: RentalDisputeSummary[];
  onUpdated: () => void | Promise<unknown>;
};

type Notice = {
  tone: 'success' | 'error';
  text: string;
};

const successMessages: Record<RentalActionKind, string> = {
  approve: 'Request approved. The borrower can now pay.',
  reject: 'Request rejected.',
  cancel: 'Rental request cancelled.',
  pay: 'Payment confirmed. Arrange the handover next.',
  handover: 'Marked ready for handover.',
  start: 'Handover confirmed. The loan is now active.',
  return: 'Return recorded.',
  inspect: 'Inspection started.',
  complete: 'Rental completed and the book is available again.',
  lost: 'Book reported lost. Both parties were notified.',
  dispute: 'Dispute raised. BookLoop will review this rental.',
};

const toneClasses = {
  primary: 'bl-button-primary',
  neutral: 'bl-button-secondary',
  danger: '',
} as const;

const dangerClasses =
  'border border-[var(--red)] bg-transparent text-[var(--red)] hover:bg-[var(--red-soft)]';

const actionIcons: Record<RentalActionKind, typeof Check> = {
  approve: Check,
  reject: X,
  cancel: X,
  pay: CreditCard,
  handover: Hand,
  start: Play,
  return: ArrowRight,
  inspect: ClipboardCheck,
  complete: CheckCircle2,
  lost: FileWarning,
  dispute: ShieldAlert,
};

export default function RentalActionsPanel({
  rentalId,
  status,
  roles,
  payTotalLabel,
  disputes = [],
  onUpdated,
}: Props) {
  const [busyKind, setBusyKind] = useState<RentalActionKind | null>(null);
  const [confirmKind, setConfirmKind] = useState<RentalActionKind | null>(null);
  const [openForm, setOpenForm] = useState<'lost' | 'dispute' | null>(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);

  const actions = getRentalActions(status, roles, rentalId);
  const waitNote = getRentalWaitNote(status, roles);
  const openDisputes = disputes.filter(
    (dispute) => dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW',
  );

  async function send(action: RentalAction, body?: Record<string, string>) {
    if (!action.request) {
      return;
    }

    try {
      setBusyKind(action.kind);
      setNotice(null);

      await apiRequest<{ success?: boolean }>(action.request.path, {
        method: action.request.method,
        auth: true,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      setConfirmKind(null);
      setOpenForm(null);
      setNotes('');
      setReason('');
      setDescription('');
      setNotice({
        tone: 'success',
        text: successMessages[action.kind],
      });

      await onUpdated();
    } catch (requestError) {
      setNotice({
        tone: 'error',
        text:
          requestError instanceof Error
            ? requestError.message
            : `Unable to ${action.label.toLowerCase()}.`,
      });
    } finally {
      setBusyKind(null);
    }
  }

  function handleActionClick(action: RentalAction) {
    if (action.needsForm) {
      const formKind = action.needsForm;

      setNotice(null);
      setOpenForm((current) =>
        current === formKind ? null : formKind,
      );
      return;
    }

    if (action.confirmBeforeSending && confirmKind !== action.kind) {
      setConfirmKind(action.kind);
      return;
    }

    void send(action);
  }

  function submitLostForm() {
    const lostAction = actions.find(
      (action) => action.kind === 'lost',
    );

    if (lostAction) {
      void send(lostAction, { notes: notes.trim() });
    }
  }

  function submitDisputeForm() {
    const trimmedReason = reason.trim();
    const trimmedDescription = description.trim();

    if (trimmedReason.length < 3) {
      setNotice({
        tone: 'error',
        text: 'Add a short reason for the dispute (at least 3 characters).',
      });
      return;
    }

    if (trimmedDescription.length < 10) {
      setNotice({
        tone: 'error',
        text: 'Describe what happened (at least 10 characters).',
      });
      return;
    }

    const disputeAction = actions.find(
      (action) => action.kind === 'dispute',
    );

    if (disputeAction) {
      void send(disputeAction, {
        reason: trimmedReason,
        description: trimmedDescription,
      });
    }
  }

  if (actions.length === 0) {
    if (!waitNote) {
      return null;
    }

    return (
      <section className="bl-card p-5 md:p-6">
        <p className="text-sm leading-6 text-[var(--ink-soft)]">{waitNote}</p>
      </section>
    );
  }

  return (
    <section className="bl-card p-5 md:p-6">
      <h2 className="text-xl">Next step</h2>

      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        {roles.isRenter
          ? 'Actions available to you as the borrower.'
          : 'Actions available to you as the book owner.'}
      </p>

      {notice && (
        <div
          role="status"
          className={`mt-4 flex items-start gap-2 rounded-2xl p-4 text-sm font-semibold ${
            notice.tone === 'success'
              ? 'bg-[var(--green-soft)] text-[var(--green)]'
              : 'bg-[var(--red-soft)] text-[var(--red)]'
          }`}
        >
          {notice.tone === 'success' ? (
            <Check size={17} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          )}
          {notice.text}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {actions.map((action) => {
          const isBusy = busyKind === action.kind;
          const isConfirming = confirmKind === action.kind;
          const Icon = actionIcons[action.kind];

          if (action.href) {
            return (
              <Link
                key={action.kind}
                href={action.href}
                className={`bl-button w-full ${toneClasses[action.tone]}`}
              >
                {action.label}
                <ArrowRight size={16} />
              </Link>
            );
          }

          if (isConfirming) {
            return (
              <div key={action.kind} className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm font-bold text-[var(--navy)]">
                  {action.kind === 'pay'
                    ? `Pay ${payTotalLabel} to confirm this booking?`
                    : `${action.label}?`}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                  {action.hint}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void send(action)}
                    className="bl-button bl-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Confirm
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setConfirmKind(null)}
                    className="bl-button bl-button-outline flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Undo2 size={16} />
                    Back
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={action.kind}>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleActionClick(action)}
                className={`bl-button w-full ${
                  action.tone === 'danger'
                    ? dangerClasses
                    : toneClasses[action.tone]
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isBusy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Icon size={16} />
                )}
                {action.label}
              </button>

              {!isBusy && action.hint && !action.needsForm && (
                <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
                  {action.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {openForm === 'lost' && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] p-4">
          <p className="text-sm font-bold text-[var(--navy)]">
            What happened to the copy?
          </p>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Optional details for the record…"
            aria-label="Lost book notes"
            className="mt-3 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--navy)]"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busyKind === 'lost'}
              onClick={submitLostForm}
              className="bl-button bl-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyKind === 'lost' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileWarning size={16} />
              )}
              Report lost
            </button>

            <button
              type="button"
              disabled={busyKind === 'lost'}
              onClick={() => setOpenForm(null)}
              className="bl-button bl-button-outline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {openForm === 'dispute' && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] p-4">
          <label className="block text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
            Reason
            <input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={200}
              placeholder="Damaged copy returned"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm normal-case tracking-normal outline-none transition focus:border-[var(--navy)]"
            />
          </label>

          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
            Details
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={3000}
              placeholder="Explain what happened and what you expect BookLoop to do."
              className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm normal-case tracking-normal outline-none transition focus:border-[var(--navy)]"
            />
          </label>

          <p className="mt-1 text-right text-xs text-[var(--ink-muted)]">
            {description.length}/3000
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busyKind === 'dispute'}
              onClick={submitDisputeForm}
              className="bl-button bl-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyKind === 'dispute' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldAlert size={16} />
              )}
              Submit dispute
            </button>

            <button
              type="button"
              disabled={busyKind === 'dispute'}
              onClick={() => setOpenForm(null)}
              className="bl-button bl-button-outline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {openDisputes.length > 0 && (
        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
            Disputes on this rental
          </p>

          <div className="mt-3 space-y-3">
            {openDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="rounded-2xl bg-[var(--offwhite)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--navy)]">
                    {dispute.reason}
                  </p>

                  <span className="rounded-full bg-[var(--red-soft)] px-3 py-1 text-xs font-bold text-[var(--red)]">
                    {dispute.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  {dispute.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
