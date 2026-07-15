/**
 * Midtrans Snap integration — SERVER ONLY. Never import from client
 * components: it reads MIDTRANS_SERVER_KEY. The browser only ever sees the
 * Snap token and NEXT_PUBLIC_MIDTRANS_CLIENT_KEY.
 *
 * Sandbox is the default; production endpoints require the explicit
 * MIDTRANS_IS_PRODUCTION=true.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

/** Snap (hosted payment page) API host. */
const SNAP_BASE = IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';

/** Core API host (status lookups). */
const API_BASE = IS_PRODUCTION ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';

/** snap.js URL for the client, matching the environment. */
export const SNAP_JS_URL = `${SNAP_BASE}/snap/snap.js`;

export function isMidtransConfigured(): boolean {
  return Boolean(process.env.MIDTRANS_SERVER_KEY);
}

function serverKey(): string {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error('MIDTRANS_SERVER_KEY is not configured');
  return key;
}

function authHeader(): string {
  return 'Basic ' + Buffer.from(`${serverKey()}:`).toString('base64');
}

export interface SnapItem {
  id: string;
  /** Unit price in whole IDR. */
  price: number;
  quantity: number;
  /** Max 50 chars per Midtrans. */
  name: string;
}

export interface CreateSnapTransactionInput {
  /** Unique order id — our order number. */
  orderId: string;
  /** Whole IDR; must equal the sum of item prices × quantities. */
  grossAmountIdr: number;
  items: SnapItem[];
  customer: { firstName: string; phone: string; email?: string };
  /** Where Snap redirects after the customer finishes the flow. */
  finishUrl: string;
}

export interface SnapTransaction {
  token: string;
  redirect_url: string;
}

export async function createSnapTransaction(
  input: CreateSnapTransactionInput
): Promise<SnapTransaction> {
  const res = await fetch(`${SNAP_BASE}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmountIdr,
      },
      item_details: input.items.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name.slice(0, 50),
      })),
      customer_details: {
        first_name: input.customer.firstName,
        phone: input.customer.phone,
        ...(input.customer.email ? { email: input.customer.email } : {}),
      },
      callbacks: { finish: input.finishUrl },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Midtrans Snap create failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return (await res.json()) as SnapTransaction;
}

export interface MidtransTransactionStatus {
  order_id: string;
  transaction_id?: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  gross_amount?: string;
  currency?: string;
  status_code?: string;
}

/**
 * Authoritative server-side status lookup. Webhook payloads are only trusted
 * after their signature verifies AND this endpoint confirms the status.
 */
export async function getTransactionStatus(
  orderId: string
): Promise<MidtransTransactionStatus | null> {
  const res = await fetch(`${API_BASE}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: 'application/json', Authorization: authHeader() },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Midtrans status lookup failed (${res.status})`);
  }
  return (await res.json()) as MidtransTransactionStatus;
}

/**
 * Midtrans notification signature:
 * sha512(order_id + status_code + gross_amount + server_key)
 */
export function verifyNotificationSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const expected = createHash('sha512')
    .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey())
    .digest('hex');
  // Constant-time compare to avoid leaking the signature via timing.
  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(payload.signature_key, 'hex');
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}
