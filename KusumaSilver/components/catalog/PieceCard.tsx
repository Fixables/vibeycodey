import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
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
  const description = locale === 'en' ? product.descriptionEn || product.description : product.description;

  const waMessage =
    locale === 'en'
      ? `Hello, I'm interested in ${product.nameEn || product.name}. Could you provide more details?`
      : `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`;
  const waLink = getWhatsAppLink(whatsapp, waMessage);

  const detailHref = `/${locale}/koleksi/${product.category}/${product.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ivory-dark bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <Link href={detailHref} className="relative block aspect-square overflow-hidden bg-ivory-dark">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">💍</div>
        )}
        {product.isCustomizable && (
          <div className="absolute left-3 top-3 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">
            {t.piece.customizable}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={detailHref}>
          <h3 className="font-heading text-base font-semibold text-espresso leading-tight line-clamp-2">
            {name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-text-light line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Specs */}
        {product.material && (
          <div className="mt-2 text-xs text-stone">
            {t.piece.material}: {product.material}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-heading text-lg font-semibold text-gold">
            {product.priceDisplay}
          </span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-espresso px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-espresso-mid"
          >
            <MessageCircle size={14} />
            {t.piece.order}
          </a>
        </div>
      </div>
    </div>
  );
}
