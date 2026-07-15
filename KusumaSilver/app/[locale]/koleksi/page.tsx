import { getCategories, getProducts } from '@/lib/sanity-data';
import { CollectionClient } from '@/components/catalog/CollectionClient';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function KoleksiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const t = getT(locale);

  return (
    <div>
      <div className="bg-ink px-5 py-14 text-center text-ink-soft">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase">{t.catalogV3.eyebrow}</p>
        <h1 className="mt-4 font-heading text-[34px] font-light lg:text-[46px]">{t.catalogV3.title}</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed text-ink-soft/60">
          {t.catalogV3.subtitle}
        </p>
      </div>

      <CollectionClient products={products} categories={categories} locale={locale} />
    </div>
  );
}
