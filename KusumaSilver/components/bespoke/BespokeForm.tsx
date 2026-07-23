'use client';

import { useState } from 'react';
import { getT } from '@/lib/i18n';
import { getWhatsAppLink } from '@/lib/whatsapp';
import type { Locale } from '@/types';

interface BespokeFormProps {
  locale: Locale;
  whatsapp: string;
}

const inputClass =
  'w-full border border-ink bg-card px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-accent';

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Bespoke enquiry form. There is no backend for enquiries — submitting opens
 * a pre-composed WhatsApp conversation (the atelier's confirmation channel)
 * and swaps the form for a thank-you panel.
 */
export function BespokeForm({ locale, whatsapp }: BespokeFormProps) {
  const t = getT(locale);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      locale === 'en'
        ? 'Hello Kusuma Silver, a Silver Class booking request:'
        : 'Halo Kusuma Silver, permintaan pemesanan Kelas Perak:',
      `${t.bespokeV3.nameLabel}: ${form.get('name')}`,
      `${t.bespokeV3.phoneLabel}: ${form.get('phone')}`,
      form.get('email') ? `${t.bespokeV3.emailLabel}: ${form.get('email')}` : null,
      `${t.bespokeV3.typeLabel}: ${form.get('type')}`,
      `${t.bespokeV3.budgetLabel}: ${form.get('budget')}`,
      '',
      String(form.get('message') ?? ''),
    ].filter((line) => line !== null);
    window.open(getWhatsAppLink(whatsapp, lines.join('\n')), '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-ink bg-card px-8 py-14 text-center">
        <h3 className="font-heading text-[26px] font-normal text-ink">
          {t.bespokeV3.thanksTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-[380px] text-sm leading-relaxed text-ink/65">
          {t.bespokeV3.thanksBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field id="bf-name" label={t.bespokeV3.nameLabel}>
          <input id="bf-name" name="name" required maxLength={200} autoComplete="name" className={inputClass} />
        </Field>
      </div>
      <Field id="bf-email" label={t.bespokeV3.emailLabel}>
        <input id="bf-email" name="email" type="email" maxLength={200} autoComplete="email" className={inputClass} />
      </Field>
      <Field id="bf-phone" label={t.bespokeV3.phoneLabel}>
        <input id="bf-phone" name="phone" required inputMode="tel" maxLength={24} autoComplete="tel" className={inputClass} />
      </Field>
      <Field id="bf-type" label={t.bespokeV3.typeLabel}>
        <select id="bf-type" name="type" className={`${inputClass} cursor-pointer`}>
          {t.bespokeV3.typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <Field id="bf-budget" label={t.bespokeV3.budgetLabel}>
        <select id="bf-budget" name="budget" className={`${inputClass} cursor-pointer`}>
          {t.bespokeV3.budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id="bf-message" label={t.bespokeV3.messageLabel}>
          <textarea id="bf-message" name="message" required rows={4} maxLength={600} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {t.bespokeV3.send}
        </button>
        <p className="mt-2 text-[11px] text-ink/45">{t.bespokeV3.sendNote}</p>
      </div>
    </form>
  );
}
