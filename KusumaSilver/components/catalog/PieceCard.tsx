import Link from 'next/link';
import Image from 'next/image';
import { getWhatsAppLink } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Product, Locale } from '@/types';

interface PieceCardProps {
  product: Product;
  locale: Locale;
  whatsapp: string;
}

export function PieceCard({ product, locale, whatsapp }: PieceCardProps) {
  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;

  const waMessage =
    locale === 'en'
      ? `Hello, I'm interested in ${product.nameEn || product.name}. Could you provide more details?`
      : `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`;
  const waLink = getWhatsAppLink(whatsapp, waMessage);

  const detailHref = `/${locale}/koleksi/${product.category}/${product.slug}`;
  const handmadeLabel = locale === 'en' ? 'Handmade in Bali' : 'Buatan Bali';

  return (
    <div className="group overflow-hidden rounded-2xl border border-warm-white-dark bg-white transition-shadow duration-300 hover:shadow-lg">
      {/* Image — portrait ratio */}
      <Link href={detailHref} className="relative block aspect-[4/5] overflow-hidden bg-charcoal">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-charcoal-light">
            <div className="h-12 w-12 rounded-full bg-silver-mid/20" />
          </div>
        )}
        {/* Handmade in Bali badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-warm-white/90 px-2.5 py-1 text-[10px] font-medium text-charcoal backdrop-blur-sm">
            {handmadeLabel}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={detailHref}>
          <h3 className="font-heading text-base font-semibold text-charcoal leading-snug line-clamp-2 transition-colors hover:text-terracotta">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-heading text-base font-semibold text-charcoal">
            {product.priceDisplay}
          </span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.piece.order}
            className="text-xs font-medium text-terracotta transition-opacity hover:opacity-70"
          >
            {locale === 'en' ? 'Order →' : 'Pesan →'}
          </a>
        </div>
      </div>
    </div>
  );
}
