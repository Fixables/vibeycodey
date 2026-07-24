/**
 * Order persistence — SERVER ONLY. Uses a Sanity client with the write token;
 * never import from client components.
 *
 * DEPLOYMENT REQUIREMENT: order documents contain customer contact details,
 * so the Sanity dataset MUST be private in production (public catalogue reads
 * then flow through the same token at build/render time).
 */

import { randomBytes } from 'node:crypto';
import { createClient } from '@sanity/client';
import { canTransitionPayment, type FulfillmentStatus, type OrderStatus, type PaymentStatus } from './status';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export function isOrderStoreConfigured(): boolean {
  return Boolean(process.env.SANITY_API_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  /** Chosen gemstone label, or null for pieces without stones. */
  gemstone: string | null;
  qty: number;
  priceIdr: number;
  lineTotalIdr: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderDoc {
  _id: string;
  _rev: string;
  orderNumber: string;
  token: string;
  locale: string;
  paymentMethod: 'midtrans' | 'whatsapp';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  subtotalIdr: number;
  shippingIdr: number;
  totalIdr: number;
  customer: OrderCustomer;
  midtrans?: { transactionId?: string; transactionStatus?: string; paymentType?: string };
  createdAt: string;
}

export function generateOrderNumber(): string {
  // Doubles as the Midtrans order_id and the webhook lookup key, so it must be
  // globally unique forever. A time component (unique per ms) plus random
  // bytes (disambiguating same-ms creates) makes collisions negligible.
  const time = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString('hex').toUpperCase();
  return `KS-${time}-${rand}`;
}

export function generateOrderToken(): string {
  // 128-bit unguessable token for the public status page URL.
  return randomBytes(16).toString('hex');
}

export async function createOrder(input: {
  locale: string;
  paymentMethod: 'midtrans' | 'whatsapp';
  items: OrderItem[];
  subtotalIdr: number;
  shippingIdr: number;
  totalIdr: number;
  customer: OrderCustomer;
}): Promise<OrderDoc> {
  const orderNumber = generateOrderNumber();
  const token = generateOrderToken();
  const createdAt = new Date().toISOString();

  const doc = await writeClient.create({
    _type: 'order',
    orderNumber,
    token,
    locale: input.locale,
    paymentMethod: input.paymentMethod,
    paymentStatus: 'payment_pending',
    orderStatus: 'order_created',
    fulfillmentStatus: 'fulfillment_pending',
    items: input.items.map((item, i) => ({ _key: `item-${i}`, ...item })),
    subtotalIdr: input.subtotalIdr,
    shippingIdr: input.shippingIdr,
    totalIdr: input.totalIdr,
    customer: input.customer,
    statusLog: [
      {
        _key: 'log-0',
        at: createdAt,
        field: 'orderStatus',
        from: null,
        to: 'order_created',
        source: 'checkout',
      },
    ],
    createdAt,
  });

  return doc as unknown as OrderDoc;
}

const ORDER_FIELDS = `
  _id,
  _rev,
  orderNumber,
  token,
  locale,
  paymentMethod,
  paymentStatus,
  orderStatus,
  fulfillmentStatus,
  items[]{ productId, slug, name, size, qty, priceIdr, lineTotalIdr },
  subtotalIdr,
  shippingIdr,
  totalIdr,
  midtrans,
  createdAt
`;

/**
 * Fetch by the unguessable status token. Deliberately does NOT project the
 * customer object — the public status page never needs or shows PII.
 */
export async function getOrderByToken(token: string): Promise<Omit<OrderDoc, 'customer'> | null> {
  if (!/^[a-f0-9]{32}$/.test(token)) return null;
  return writeClient.fetch<Omit<OrderDoc, 'customer'> | null>(
    `*[_type == "order" && token == $token][0]{ ${ORDER_FIELDS} }`,
    { token } as Record<string, string>
  );
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDoc | null> {
  return writeClient.fetch<OrderDoc | null>(
    `*[_type == "order" && orderNumber == $orderNumber][0]{ ${ORDER_FIELDS}, customer }`,
    { orderNumber } as Record<string, string>
  );
}

/**
 * Guarded, idempotent payment-status transition with optimistic locking.
 *
 * The legality check and the write must be atomic, otherwise two concurrent
 * webhook deliveries can both read `payment_pending`, both pass the guard, and
 * both patch — letting write-ordering (not the transition table) decide the
 * final state. We patch with `ifRevisionId` so a racing writer causes a
 * revision conflict; on conflict we re-read and re-evaluate, so duplicate and
 * out-of-order deliveries collapse to a single correct transition (or a noop).
 */
export async function applyPaymentStatus(
  order: Pick<OrderDoc, '_id' | '_rev' | 'paymentStatus'>,
  next: PaymentStatus,
  source: string,
  midtrans?: { transactionId?: string; transactionStatus?: string; paymentType?: string }
): Promise<'applied' | 'noop'> {
  let current: Pick<OrderDoc, '_id' | '_rev' | 'paymentStatus'> = order;

  for (let attempt = 0; attempt < 4; attempt++) {
    if (!canTransitionPayment(current.paymentStatus, next)) return 'noop';

    try {
      await writeClient
        .patch(current._id)
        .ifRevisionId(current._rev)
        .set({ paymentStatus: next, ...(midtrans ? { midtrans } : {}) })
        .append('statusLog', [
          {
            _key: `log-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
            at: new Date().toISOString(),
            field: 'paymentStatus',
            from: current.paymentStatus,
            to: next,
            source,
          },
        ])
        .commit({ visibility: 'async' });
      return 'applied';
    } catch (err) {
      // Revision conflict → another writer moved the order; re-read and retry.
      if (!isRevisionConflict(err)) throw err;
      const fresh = await writeClient.fetch<Pick<OrderDoc, '_id' | '_rev' | 'paymentStatus'> | null>(
        `*[_type == "order" && _id == $id][0]{ _id, _rev, paymentStatus }`,
        { id: current._id } as Record<string, string>
      );
      if (!fresh) return 'noop';
      current = fresh;
    }
  }
  return 'noop';
}

function isRevisionConflict(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const statusCode = (err as { statusCode?: number; response?: { statusCode?: number } }).statusCode;
  const nested = (err as { response?: { statusCode?: number } }).response?.statusCode;
  return statusCode === 409 || nested === 409;
}
