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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-warm-white-dark bg-white transition-shadow duration-300 hover:shadow-lg">
      {/* Image — portrait ratio for jewelry */}
      <Link href={detailHref} className="relative block aspect-[4/5] overflow-hidden bg-warm-white-dark">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-warm-white-mid">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-silver-mid/20">
              <div className="h-8 w-8 rounded-full bg-silver-mid/40" />
            </div>
          </div>
        )}
        {product.isCustomizable && (
          <div className="absolute left-3 top-3 rounded-full bg-charcoal px-2.5 py-0.5 text-xs font-semibold text-warm-white">
            {t.piece.customizable}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={detailHref}>
          <h3 className="font-heading text-base font-semibold text-charcoal leading-tight line-clamp-2 transition-colors hover:text-terracotta">
            {name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-text-muted line-clamp-2 leading-relaxed">
          {description}
        </p>

        {product.material && (
          <div className="mt-2 text-xs text-silver-dark">
            {t.piece.material}: {product.material}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-warm-white-dark mt-4">
          <span className="font-heading text-lg font-semibold text-terracotta">
            {product.priceDisplay}
          </span>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.piece.order}
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-charcoal text-warm-white transition-colors duration-200 hover:bg-charcoal-mid"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
