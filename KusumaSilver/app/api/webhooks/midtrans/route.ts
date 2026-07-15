import { NextRequest, NextResponse } from 'next/server';
import {
  getTransactionStatus,
  isMidtransConfigured,
  verifyNotificationSignature,
} from '@/lib/commerce/midtrans';
import { applyPaymentStatus, getOrderByNumber, isOrderStoreConfigured } from '@/lib/commerce/orders';
import { mapMidtransStatus } from '@/lib/commerce/status';

export const dynamic = 'force-dynamic';

/**
 * Midtrans payment notification webhook.
 *
 * Trust model: a payload counts for nothing until (1) its sha512 signature
 * verifies against our server key, and (2) the transaction status is
 * re-queried server-side from Midtrans — the re-queried status is what gets
 * applied, so replayed or stale payloads cannot rewrite history. Transitions
 * are guarded (see lib/commerce/status.ts), making duplicate and out-of-order
 * deliveries harmless no-ops. Reaching any success URL never marks an order
 * paid — only this path does.
 */
export async function POST(request: NextRequest) {
  if (!isMidtransConfigured() || !isOrderStoreConfigured()) {
    return NextResponse.json({ error: 'unconfigured' }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const orderId = typeof payload.order_id === 'string' ? payload.order_id : null;
  const statusCode = typeof payload.status_code === 'string' ? payload.status_code : null;
  const grossAmount = typeof payload.gross_amount === 'string' ? payload.gross_amount : null;
  const signatureKey = typeof payload.signature_key === 'string' ? payload.signature_key : null;
  if (!orderId || !statusCode || !grossAmount || !signatureKey) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (
    !verifyNotificationSignature({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
    })
  ) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 403 });
  }

  const order = await getOrderByNumber(orderId);
  if (!order || order.paymentMethod !== 'midtrans') {
    return NextResponse.json({ error: 'unknown_order' }, { status: 404 });
  }

  // Amount and currency must match the server-side order record.
  if (Math.round(parseFloat(grossAmount)) !== order.totalIdr) {
    return NextResponse.json({ error: 'amount_mismatch' }, { status: 400 });
  }
  if (typeof payload.currency === 'string' && payload.currency !== 'IDR') {
    return NextResponse.json({ error: 'currency_mismatch' }, { status: 400 });
  }

  // Authoritative status re-query; a transient failure returns 500 so
  // Midtrans retries the notification later.
  let live;
  try {
    live = await getTransactionStatus(orderId);
  } catch {
    return NextResponse.json({ error: 'status_lookup_failed' }, { status: 500 });
  }
  // A signed notification for a known order whose status isn't queryable yet is
  // a transient race — ask Midtrans to retry (500) rather than dropping it (404).
  if (!live) {
    return NextResponse.json({ error: 'status_not_ready' }, { status: 500 });
  }
  if (live.currency && live.currency !== 'IDR') {
    return NextResponse.json({ error: 'currency_mismatch' }, { status: 400 });
  }

  const next = mapMidtransStatus(live.transaction_status, live.fraud_status);
  if (!next) {
    // Status we deliberately don't act on (e.g. authorize) — acknowledge.
    return NextResponse.json({ ok: true, applied: false });
  }

  const result = await applyPaymentStatus(order, next, 'midtrans_webhook', {
    transactionId: live.transaction_id,
    transactionStatus: live.transaction_status,
    paymentType: live.payment_type,
  });

  return NextResponse.json({ ok: true, applied: result === 'applied' });
}
