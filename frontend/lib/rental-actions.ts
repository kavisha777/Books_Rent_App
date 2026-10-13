export type RentalActionKind =
  | 'approve'
  | 'reject'
  | 'cancel'
  | 'pay'
  | 'handover'
  | 'start'
  | 'return'
  | 'inspect'
  | 'complete'
  | 'lost'
  | 'dispute';

export type RentalActionRequest = {
  method: 'POST' | 'PATCH';
  path: string;
};

export type RentalAction = {
  kind: RentalActionKind;
  label: string;
  hint: string;
  tone: 'primary' | 'neutral' | 'danger';
  request?: RentalActionRequest;
  href?: string;
  needsForm?: 'lost' | 'dispute';
  confirmBeforeSending?: boolean;
};

export type RentalRoles = {
  isRenter: boolean;
  isOwner: boolean;
};

const partyRequest = (rentalId: string, suffix: string): RentalActionRequest => ({
  method: 'PATCH',
  path: `/rentals/${rentalId}/${suffix}`,
});

/**
 * Mirrors the guards in backend/src/controllers/rental.controller.ts, so the UI
 * only offers transitions the API will accept for this user and status.
 */
export function getRentalActions(
  status: string,
  { isRenter, isOwner }: RentalRoles,
  rentalId: string,
): RentalAction[] {
  const isParty = isRenter || isOwner;
  const actions: RentalAction[] = [];

  if (status === 'REQUESTED') {
    if (isOwner) {
      actions.push({
        kind: 'approve',
        label: 'Approve request',
        hint: 'The borrower can then pay to confirm the booking.',
        tone: 'primary',
        request: partyRequest(rentalId, 'approve'),
      });

      actions.push({
        kind: 'reject',
        label: 'Reject request',
        hint: 'Declines this request for your copy.',
        tone: 'danger',
        request: partyRequest(rentalId, 'reject'),
        confirmBeforeSending: true,
      });
    }

    if (isRenter) {
      actions.push({
        kind: 'cancel',
        label: 'Cancel request',
        hint: 'Withdraws your request before it is confirmed.',
        tone: 'danger',
        request: partyRequest(rentalId, 'cancel'),
        confirmBeforeSending: true,
      });
    }
  }

  if (status === 'APPROVED' && isRenter) {
    actions.push({
      kind: 'pay',
      label: 'Pay and confirm',
      hint: 'Pays the rental amount plus your refundable security deposit.',
      tone: 'primary',
      request: { method: 'POST', path: `/rentals/${rentalId}/pay` },
      confirmBeforeSending: true,
    });

    actions.push({
      kind: 'cancel',
      label: 'Cancel request',
      hint: 'Withdraws your request before the handover.',
      tone: 'danger',
      request: partyRequest(rentalId, 'cancel'),
      confirmBeforeSending: true,
    });
  }

  if (status === 'PAYMENT_PENDING' && isRenter) {
    actions.push({
      kind: 'cancel',
      label: 'Cancel request',
      hint: 'Withdraws your request before the handover.',
      tone: 'danger',
      request: partyRequest(rentalId, 'cancel'),
      confirmBeforeSending: true,
    });
  }

  /*
   * Handover and start are open to both parties, since lender and borrower
   * meet in person and either of them can record the swap.
   */
  if (status === 'CONFIRMED' && isParty) {
    actions.push({
      kind: 'handover',
      label: 'Arrange handover',
      hint: 'Marks the copy as ready to be handed over in person.',
      tone: 'primary',
      request: partyRequest(rentalId, 'handover'),
    });
  }

  if (status === 'HANDOVER_PENDING' && isParty) {
    actions.push({
      kind: 'start',
      label: 'Confirm handover',
      hint: 'Starts the loan and takes the copy off the catalogue.',
      tone: 'primary',
      request: partyRequest(rentalId, 'start'),
      confirmBeforeSending: true,
    });
  }

  if ((status === 'ACTIVE' || status === 'OVERDUE') && isRenter) {
    actions.push({
      kind: 'return',
      label: 'Return book',
      hint: 'Records the condition of the copy, then hands it back.',
      tone: 'primary',
      href: `/rentals/${rentalId}/return`,
    });
  }

  if (status === 'RETURN_PENDING' && isOwner) {
    actions.push({
      kind: 'inspect',
      label: 'Start inspection',
      hint: 'Confirms you received the copy back.',
      tone: 'primary',
      request: partyRequest(rentalId, 'inspect'),
    });
  }

  if (status === 'INSPECTION' && isOwner) {
    actions.push({
      kind: 'complete',
      label: 'Complete rental',
      hint: 'Closes the rental and lists the copy as available again.',
      tone: 'primary',
      request: partyRequest(rentalId, 'complete'),
      confirmBeforeSending: true,
    });
  }

  if (
    isParty &&
    (status === 'ACTIVE' || status === 'OVERDUE' || status === 'RETURN_PENDING')
  ) {
    actions.push({
      kind: 'lost',
      label: 'Report lost',
      hint: 'The copy is not coming back. It stays off the catalogue.',
      tone: 'danger',
      needsForm: 'lost',
      request: partyRequest(rentalId, 'lost'),
    });
  }

  if (
    isParty &&
    !['REQUESTED', 'REJECTED', 'CANCELLED', 'DISPUTED'].includes(status)
  ) {
    actions.push({
      kind: 'dispute',
      label: 'Raise a dispute',
      hint: 'Ask BookLoop to review this rental. It pauses the rental until resolved.',
      tone: 'neutral',
      needsForm: 'dispute',
      request: { method: 'POST', path: `/rentals/${rentalId}/disputes` },
    });
  }

  return actions;
}

/**
 * Shown when the action list is empty, so a party is never left wondering
 * whether the flow stalled.
 */
export function getRentalWaitNote(
  status: string,
  { isRenter }: RentalRoles,
): string | null {
  if (status === 'DISPUTED') {
    return 'A dispute is open on this rental. BookLoop will restore its status once the dispute is resolved.';
  }

  if (status === 'REQUESTED' && isRenter) {
    return 'Waiting for the book owner to review your request.';
  }

  if (status === 'APPROVED' && !isRenter) {
    return 'Approved. Waiting for the borrower to pay before the handover.';
  }

  if (status === 'ACTIVE' && !isRenter) {
    return 'On loan to the borrower. Start the inspection once they hand it back.';
  }

  if (status === 'OVERDUE' && !isRenter) {
    return 'This loan is overdue. Chase the borrower, or report the copy lost if it never returns.';
  }

  if (status === 'RETURN_PENDING' && isRenter) {
    return 'Return recorded. The owner is next to inspect the copy.';
  }

  if (status === 'INSPECTION' && isRenter) {
    return 'The owner is inspecting the copy you returned.';
  }

  if (status === 'COMPLETED') {
    return 'This rental is closed. Leave a review to finish it off.';
  }

  if (status === 'CANCELLED') {
    return 'This rental was cancelled.';
  }

  if (status === 'REJECTED') {
    return 'This request was rejected by the book owner.';
  }

  if (status === 'LOST') {
    return 'This rental was reported lost. The copy stays unavailable in the catalogue.';
  }

  return null;
}
