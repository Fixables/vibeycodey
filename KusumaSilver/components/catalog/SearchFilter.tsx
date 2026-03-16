'use client';

import { Search } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface SearchFilterProps {
  value: string;
  onChange: (v: string) => void;
  locale: Locale;
}

export function SearchFilter({ value, onChange, locale }: SearchFilterProps) {
  const t = getT(locale);

  return (
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.catalog.search}
        className="w-full rounded-xl border border-ivory-dark bg-white py-3 pl-10 pr-4 text-sm text-text outline-none transition-colors focus:border-espresso placeholder:text-stone"
      />
    </div>
  );
}
