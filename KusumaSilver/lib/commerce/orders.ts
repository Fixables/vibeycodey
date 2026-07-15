/**
 * Order persistence — SERVER ONLY. Uses a Sanity client with the write token;
 * never import from client components.
 *
 * DEPLOYMENT REQUIREMENT: order documents contain customer contact details,
 * so the Sanity dataset MUST be private in production (public catalogue reads
 * then flow through the same token at build/render time).
 */

import { randomInt, randomBytes } from 'node:crypto';
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
  // Human-facing display number, distinct from the secret status token.
  return 'KS-' + String(randomInt(100000, 1000000));
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
 * Guarded, idempotent payment-status transition. Illegal moves (duplicate or
 * out-of-order webhook deliveries) are ignored and reported as no-ops.
 */
export async function applyPaymentStatus(
  order: Pick<OrderDoc, '_id' | 'paymentStatus'>,
  next: PaymentStatus,
  source: string,
  midtrans?: { transactionId?: string; transactionStatus?: string; paymentType?: string }
): Promise<'applied' | 'noop'> {
  if (!canTransitionPayment(order.paymentStatus, next)) return 'noop';

  await writeClient
    .patch(order._id)
    .set({ paymentStatus: next, ...(midtrans ? { midtrans } : {}) })
    .append('statusLog', [
      {
        _key: `log-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        at: new Date().toISOString(),
        field: 'paymentStatus',
        from: order.paymentStatus,
        to: next,
        source,
      },
    ])
    .commit();

  return 'applied';
}
