'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { getT } from '@/lib/i18n';
import type { Currency } from '@/lib/commerce/config';
import type { Locale } from '@/types';

interface UtilityBarProps {
  locale: Locale;
  /** Announcement text from Site Settings; falls back to the built-in wording. */
  promo?: string;
}

function persistLocaleCookie(next: Locale) {
  document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
}

export function UtilityBar({ locale, promo }: UtilityBarProps) {
  const t = getT(locale);
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { currency, setCurrency } = useCurrency();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    const nextPath = pathname
      .split('/')
      .map((segment, i) => (i === 1 ? next : segment))
      .join('/');
    persistLocaleCookie(next);
    startTransition(() => router.push(nextPath));
  }

  const toggleOn = 'font-semibold text-ink-soft';
  const toggleOff = 'text-ink-soft/45 hover:text-ink-soft/75 transition-colors';

  function localeButton(value: Locale, label: string) {
    return (
      <button
        onClick={() => switchLocale(value)}
        className={`cursor-pointer text-[11px] tracking-[0.08em] ${locale === value ? toggleOn : toggleOff}`}
        aria-pressed={locale === value}
      >
        {label}
      </button>
    );
  }

  function currencyButton(value: Currency, label: string) {
    return (
      <button
        onClick={() => setCurrency(value)}
        className={`cursor-pointer text-[11px] tracking-[0.08em] ${currency === value ? toggleOn : toggleOff}`}
        aria-pressed={currency === value}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-ink px-5 py-[9px] text-[11px] font-medium tracking-[0.08em] text-ink-soft/75 sm:px-10">
      <div className="flex items-center gap-[7px]">
        {localeButton('en', 'EN')}
        <span className="opacity-35">|</span>
        {localeButton('id', 'ID')}
      </div>
      <span className="hidden uppercase tracking-[0.18em] md:inline">{promo || t.chrome.shipbar}</span>
      <div className="flex items-center gap-[7px]">
        {currencyButton('idr', 'IDR')}
        <span className="opacity-35">|</span>
        {currencyButton('usd', 'USD')}
      </div>
    </div>
  );
}
