import { defineField, defineType } from 'sanity';

/**
 * Customer order. Created server-side by the checkout API route — never from
 * the Studio. Status fields are advanced only by the Midtrans webhook /
 * server-side status lookup (payment) or manually in Studio (fulfillment).
 * No card numbers, CVVs, or banking credentials are ever stored here.
 */
export const order = defineType({
  name: 'order',
  title: 'Pesanan',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Nomor Pesanan',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'token',
      title: 'Status Token (rahasia)',
      description: 'Unguessable token for the public order-status page.',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Bahasa',
      type: 'string',
      readOnly: true,
      options: { list: ['id', 'en'] },
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Metode Pembayaran',
      type: 'string',
      readOnly: true,
      options: { list: ['midtrans', 'whatsapp'] },
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Status Pembayaran',
      type: 'string',
      options: {
        list: [
          'payment_pending',
          'paid',
          'payment_failed',
          'payment_expired',
          'payment_cancelled',
          'refunded',
        ],
      },
    }),
    defineField({
      name: 'orderStatus',
      title: 'Status Pesanan',
      type: 'string',
      options: { list: ['order_created', 'order_cancelled'] },
    }),
    defineField({
      name: 'fulfillmentStatus',
      title: 'Status Pengiriman',
      type: 'string',
      options: { list: ['fulfillment_pending', 'fulfilled'] },
    }),
    defineField({
      name: 'items',
      title: 'Barang',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', title: 'Product ID', type: 'string' },
            { name: 'slug', title: 'Slug', type: 'string' },
            { name: 'name', title: 'Nama', type: 'string' },
            { name: 'size', title: 'Ukuran', type: 'string' },
            { name: 'qty', title: 'Jumlah', type: 'number' },
            { name: 'priceIdr', title: 'Harga Satuan (IDR)', type: 'number' },
            { name: 'lineTotalIdr', title: 'Subtotal Baris (IDR)', type: 'number' },
          ],
          preview: {
            select: { title: 'name', qty: 'qty', size: 'size' },
            prepare({ title, qty, size }) {
              return { title: `${title} × ${qty}`, subtitle: size ? `Ukuran ${size}` : undefined };
            },
          },
        },
      ],
    }),
    defineField({ name: 'subtotalIdr', title: 'Subtotal (IDR)', type: 'number', readOnly: true }),
    defineField({ name: 'shippingIdr', title: 'Ongkir (IDR)', type: 'number', readOnly: true }),
    defineField({ name: 'totalIdr', title: 'Total (IDR)', type: 'number', readOnly: true }),
    defineField({
      name: 'customer',
      title: 'Pelanggan',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'name', title: 'Nama', type: 'string' },
        { name: 'phone', title: 'WhatsApp / Telepon', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'address', title: 'Alamat', type: 'text', rows: 2 },
        { name: 'city', title: 'Kota', type: 'string' },
        { name: 'province', title: 'Provinsi', type: 'string' },
        { name: 'postalCode', title: 'Kode Pos', type: 'string' },
        { name: 'notes', title: 'Catatan', type: 'text', rows: 2 },
      ],
    }),
    defineField({
      name: 'midtrans',
      title: 'Midtrans',
      type: 'object',
      readOnly: true,
      fields: [
        { name: 'transactionId', title: 'Transaction ID', type: 'string' },
        { name: 'transactionStatus', title: 'Status Transaksi', type: 'string' },
        { name: 'paymentType', title: 'Tipe Pembayaran', type: 'string' },
      ],
    }),
    defineField({
      name: 'statusLog',
      title: 'Riwayat Status',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'at', title: 'Waktu', type: 'datetime' },
            { name: 'field', title: 'Field', type: 'string' },
            { name: 'from', title: 'Dari', type: 'string' },
            { name: 'to', title: 'Ke', type: 'string' },
            { name: 'source', title: 'Sumber', type: 'string' },
          ],
          preview: {
            select: { field: 'field', from: 'from', to: 'to', at: 'at' },
            prepare({ field, from, to, at }) {
              return { title: `${field}: ${from ?? '—'} → ${to}`, subtitle: at };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Dibuat',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Terbaru',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'orderNumber',
      payment: 'paymentStatus',
      fulfillment: 'fulfillmentStatus',
      total: 'totalIdr',
    },
    prepare({ title, payment, fulfillment, total }) {
      return {
        title: title ?? 'Pesanan',
        subtitle: `${payment ?? '—'} · ${fulfillment ?? '—'} · Rp ${Number(total ?? 0).toLocaleString('id-ID')}`,
      };
    },
  },
});
