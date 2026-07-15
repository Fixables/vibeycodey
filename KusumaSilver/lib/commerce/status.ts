/**
 * Normalized commerce status model. Three independent axes — payment, order,
 * fulfillment — with a guarded transition table so duplicate or out-of-order
 * webhook deliveries can never move an order backwards.
 */

export type PaymentStatus =
  | 'payment_pending'
  | 'paid'
  | 'payment_failed'
  | 'payment_expired'
  | 'payment_cancelled'
  | 'refunded';

export type OrderStatus = 'order_created' | 'order_cancelled';

export type FulfillmentStatus = 'fulfillment_pending' | 'fulfilled';

/** Allowed forward transitions per axis. Anything not listed is ignored. */
const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  payment_pending: ['paid', 'payment_failed', 'payment_expired', 'payment_cancelled'],
  paid: ['refunded'],
  payment_failed: [],
  payment_expired: [],
  payment_cancelled: [],
  refunded: [],
};

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return false;
  return PAYMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Map a Midtrans transaction_status (+ fraud_status for card payments) to the
 * normalized payment status. Returns null for statuses that should not change
 * anything (e.g. `authorize`, unknown values).
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): PaymentStatus | null {
  switch (transactionStatus) {
    case 'capture':
      // `challenge` is held for manual review (no state change); `deny` fails;
      // `accept` or an absent fraud_status means the capture succeeded.
      if (fraudStatus === 'challenge') return null;
      if (fraudStatus === 'deny') return 'payment_failed';
      return 'paid';
    case 'settlement':
      return 'paid';
    case 'pending':
      return 'payment_pending';
    case 'deny':
      return 'payment_failed';
    case 'expire':
      return 'payment_expired';
    case 'cancel':
      return 'payment_cancelled';
    case 'refund':
    case 'partial_refund':
      return 'refunded';
    default:
      return null;
  }
}
