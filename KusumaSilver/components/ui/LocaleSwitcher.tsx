'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/types';

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return;

    // Replace the current locale segment in the path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    // Save preference in cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-stone/30 p-1">
      <button
        onClick={() => switchLocale('id')}
        disabled={isPending}
        className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
          currentLocale === 'id'
            ? 'bg-espresso text-white'
            : 'text-text-light hover:text-espresso'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`rounded px-2 py-0.5 text-xs font-semibold transition-colors ${
          currentLocale === 'en'
            ? 'bg-espresso text-white'
            : 'text-text-light hover:text-espresso'
        }`}
      >
        EN
      </button>
    </div>
  );
}
