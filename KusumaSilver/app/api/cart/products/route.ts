import { NextRequest, NextResponse } from 'next/server';
import { client, urlFor } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

const MAX_IDS = 30;

interface Row {
  _id: string;
  name: string;
  nameEn?: string;
  price: number;
  slug: string;
  category: string;
  inStock: boolean;
  image?: Record<string, unknown>;
}

/**
 * Public catalogue data for the IDs held in a client cart (the cart itself
 * stores no names or prices). Returns catalogue fields only — this endpoint
 * exposes nothing that the product pages don't already show.
 */
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids') ?? '';
  const ids = [...new Set(idsParam.split(',').map((id) => id.trim()).filter(Boolean))].slice(
    0,
    MAX_IDS
  );
  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const rows = await client.fetch<Row[]>(
    `*[_type == "product" && _id in $ids]{
      _id, name, nameEn, price,
      "slug": slug.current,
      "category": category->slug.current,
      inStock,
      "image": images[0]
    }`,
    { ids }
  );

  const products = rows.map((row) => {
    let imageUrl: string | undefined;
    if (row.image) {
      try {
        imageUrl = urlFor(row.image).width(240).height(300).url();
      } catch {
        imageUrl = undefined;
      }
    }
    return {
      id: row._id,
      slug: row.slug,
      category: row.category,
      name: row.name,
      nameEn: row.nameEn ?? '',
      priceIdr: row.price,
      inStock: row.inStock,
      imageUrl,
    };
  });

  return NextResponse.json({ products });
}
