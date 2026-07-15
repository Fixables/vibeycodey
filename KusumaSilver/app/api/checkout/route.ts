import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { shippingForSubtotalIdr } from '@/lib/commerce/shipping';
import { MAX_QTY_PER_LINE } from '@/lib/commerce/cart';
import {
  createOrder,
  isOrderStoreConfigured,
  type OrderCustomer,
  type OrderItem,
} from '@/lib/commerce/orders';
import { createSnapTransaction, isMidtransConfigured } from '@/lib/commerce/midtrans';

export const dynamic = 'force-dynamic';

const MAX_LINES = 20;
const MAX_FIELD = 200;
const MAX_TEXT = 600;

interface CheckoutLine {
  productId: string;
  size: string | null;
  qty: number;
}

interface CheckoutBody {
  method: 'midtrans' | 'whatsapp';
  locale: string;
  items: CheckoutLine[];
  customer: OrderCustomer;
}

function str(value: unknown, max = MAX_FIELD): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function optStr(value: unknown, max = MAX_FIELD): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return str(value, max) ?? undefined;
}

/** Parse + bound the request. Returns null on any malformed input. */
function parseBody(raw: unknown): CheckoutBody | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const body = raw as Record<string, unknown>;

  const method = body.method === 'whatsapp' ? 'whatsapp' : body.method === 'midtrans' ? 'midtrans' : null;
  const locale = body.locale === 'en' ? 'en' : 'id';
  if (!method) return null;

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > MAX_LINES) {
    return null;
  }
  const items: CheckoutLine[] = [];
  for (const rawLine of body.items) {
    const line = rawLine as Record<string, unknown>;
    const productId = str(line.productId, 120);
    const qty = Number(line.qty);
    const size = line.size === null || line.size === undefined ? null : str(line.size, 40);
    if (!productId || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) return null;
    items.push({ productId, size, qty });
  }

  const rawCustomer = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(rawCustomer.name);
  const phone = str(rawCustomer.phone, 32);
  const address = str(rawCustomer.address, MAX_TEXT);
  const city = str(rawCustomer.city);
  if (!name || !phone || !address || !city) return null;
  if (!/^[+0-9][0-9\s-]{6,20}$/.test(phone)) return null;

  const email = optStr(rawCustomer.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const customer: OrderCustomer = {
    name,
    phone,
    email,
    address,
    city,
    province: optStr(rawCustomer.province),
    postalCode: optStr(rawCustomer.postalCode, 12),
    notes: optStr(rawCustomer.notes, MAX_TEXT),
  };

  return { method, locale, items, customer };
}

interface CatalogRow {
  _id: string;
  name: string;
  nameEn?: string;
  price: number;
  slug: string;
  category: string;
  inStock: boolean;
}

export async function POST(request: NextRequest) {
  if (!isOrderStoreConfigured()) {
    return NextResponse.json({ error: 'store_unconfigured' }, { status: 503 });
  }

  let body: CheckoutBody | null = null;
  try {
    body = parseBody(await request.json());
  } catch {
    body = null;
  }
  if (!body) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // Server-authoritative revalidation: prices, stock, and existence come from
  // Sanity at this moment — the browser's numbers are never trusted.
  const ids = [...new Set(body.items.map((line) => line.productId))];
  const rows = await client.fetch<CatalogRow[]>(
    `*[_type == "product" && _id in $ids]{
      _id, name, nameEn, price,
      "slug": slug.current,
      "category": category->slug.current,
      inStock
    }`,
    { ids }
  );
  const bySanityId = new Map(rows.map((row) => [row._id, row]));

  const unavailable: string[] = [];
  const orderItems: OrderItem[] = [];
  for (const line of body.items) {
    const row = bySanityId.get(line.productId);
    if (!row || !row.inStock || typeof row.price !== 'number' || row.price <= 0) {
      unavailable.push(line.productId);
      continue;
    }
    const name = body.locale === 'en' ? row.nameEn || row.name : row.name;
    orderItems.push({
      productId: row._id,
      slug: row.slug,
      name,
      size: line.size,
      qty: line.qty,
      priceIdr: Math.round(row.price),
      lineTotalIdr: Math.round(row.price) * line.qty,
    });
  }
  if (unavailable.length > 0) {
    return NextResponse.json({ error: 'items_unavailable', productIds: unavailable }, { status: 409 });
  }

  const subtotalIdr = orderItems.reduce((sum, item) => sum + item.lineTotalIdr, 0);
  const shippingIdr = shippingForSubtotalIdr(subtotalIdr);
  const totalIdr = subtotalIdr + shippingIdr;

  if (body.method === 'midtrans' && !isMidtransConfigured()) {
    return NextResponse.json({ error: 'midtrans_unconfigured' }, { status: 503 });
  }

  const order = await createOrder({
    locale: body.locale,
    paymentMethod: body.method,
    items: orderItems,
    subtotalIdr,
    shippingIdr,
    totalIdr,
    customer: body.customer,
  });

  const statusUrl = `/${body.locale}/order/${order.token}`;

  if (body.method === 'whatsapp') {
    const storeInfo = await getStoreInfo();
    const lines = orderItems
      .map((item) => `- ${item.name}${item.size ? ` (${item.size})` : ''} × ${item.qty}`)
      .join('\n');
    const message =
      body.locale === 'en'
        ? `Hello Kusuma Silver, I would like to order (${order.orderNumber}):\n${lines}\nTotal: Rp ${totalIdr.toLocaleString('id-ID')} (incl. shipping)`
        : `Halo Kusuma Silver, saya ingin memesan (${order.orderNumber}):\n${lines}\nTotal: Rp ${totalIdr.toLocaleString('id-ID')} (termasuk ongkir)`;
    return NextResponse.json({
      orderNumber: order.orderNumber,
      orderToken: order.token,
      statusUrl,
      whatsappUrl: getWhatsAppLink(storeInfo.whatsapp, message),
    });
  }

  try {
    const snap = await createSnapTransaction({
      orderId: order.orderNumber,
      grossAmountIdr: totalIdr,
      items: [
        ...orderItems.map((item) => ({
          id: item.productId.slice(0, 50),
          price: item.priceIdr,
          quantity: item.qty,
          name: item.size ? `${item.name} (${item.size})` : item.name,
        })),
        ...(shippingIdr > 0
          ? [{ id: 'shipping', price: shippingIdr, quantity: 1, name: 'Shipping' }]
          : []),
      ],
      customer: {
        firstName: body.customer.name,
        phone: body.customer.phone,
        email: body.customer.email,
      },
      finishUrl: `${request.nextUrl.origin}${statusUrl}`,
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      orderToken: order.token,
      statusUrl,
      snapToken: snap.token,
    });
  } catch {
    // Order exists but payment could not start; surface a retryable error
    // without leaking provider details. (No customer data is logged.)
    return NextResponse.json(
      { error: 'payment_init_failed', orderToken: order.token, statusUrl },
      { status: 502 }
    );
  }
}
