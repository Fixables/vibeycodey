import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface FeaturedCollectionsProps {
  locale: Locale;
}

export async function FeaturedCollections({ locale }: FeaturedCollectionsProps) {
  const categories = await getCategories();
  const t = getT(locale);
  const featured = categories.slice(0, 6);

  return (
    <section className="bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <h2 className="font-heading text-3xl font-light text-charcoal text-center sm:text-4xl">
          {t.collections.title}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-10 bg-silver-mid/60" />
          <div className="h-1 w-1 rounded-full bg-silver-dark" />
          <div className="h-px w-10 bg-silver-mid/60" />
        </div>

        {/* Category cards — horizontal scroll on mobile */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featured.slice(0, 4).map((category) => {
            const displayName = locale === 'en' ? category.nameEn || category.name : category.name;
            const abbrev = displayName.slice(0, 2).toUpperCase();

            return (
              <Link
                key={category.slug}
                href={`/${locale}/koleksi/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-charcoal"
              >
                {/* Image or dark placeholder */}
                <div className="relative aspect-[3/4]">
                  {category.coverImageUrl ? (
                    <Image
                      src={category.coverImageUrl}
                      alt={displayName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-charcoal-light">
                      <span className="font-heading text-5xl font-light text-silver-bright/20 select-none">
                        {abbrev}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Category label at bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                  <span className="font-heading text-sm font-semibold text-warm-white">
                    {displayName}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-warm-white/70 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/koleksi`}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal px-7 py-2.5 text-sm font-medium text-charcoal transition-all duration-200 hover:bg-charcoal hover:text-warm-white"
          >
            {t.collections.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
