import { getStoreInfo } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface InstagramSectionProps {
  locale: Locale;
}

export async function InstagramSection({ locale }: InstagramSectionProps) {
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const handle = storeInfo.socialMedia?.instagram;

  if (!handle) return null;

  return (
    <section className="bg-warm-white-mid py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Ornamental divider */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-silver-mid/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-silver-mid" />
          <div className="h-px w-16 bg-silver-mid/40" />
        </div>

        {/* Instagram icon — brand gradient kept for recognition */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
          <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>

        <h2 className="font-heading text-2xl font-light text-charcoal sm:text-3xl">
          {t.instagram.title}
        </h2>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-warm-white transition-colors hover:bg-charcoal-mid"
        >
          {t.instagram.follow}
        </a>
      </div>
    </section>
  );
}
