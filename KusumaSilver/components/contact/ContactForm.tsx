'use client';

import { useState } from 'react';
import { getT } from '@/lib/i18n';
import { getWhatsAppLink } from '@/lib/whatsapp';
import type { Locale } from '@/types';

interface ContactFormProps {
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
 * Contact form. Messages have no backend — submitting opens a pre-composed
 * WhatsApp conversation and swaps the form for a thank-you panel.
 */
export function ContactForm({ locale, whatsapp }: ContactFormProps) {
  const t = getT(locale);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const intro =
      locale === 'en'
        ? `Hello Kusuma Silver, my name is ${form.get('name')} (${form.get('phone')}).`
        : `Halo Kusuma Silver, nama saya ${form.get('name')} (${form.get('phone')}).`;
    const text = `${intro}\n\n${form.get('message')}`;
    window.open(getWhatsAppLink(whatsapp, text), '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-ink bg-card px-8 py-14 text-center">
        <h3 className="font-heading text-[26px] font-normal text-ink">
          {t.contactV3.thanksTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-[380px] text-sm leading-relaxed text-ink/65">
          {t.contactV3.thanksBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field id="cf-name" label={t.contactV3.nameLabel}>
          <input id="cf-name" name="name" required maxLength={200} autoComplete="name" className={inputClass} />
        </Field>
      </div>
      <Field id="cf-email" label={t.contactV3.emailFieldLabel}>
        <input id="cf-email" name="email" type="email" maxLength={200} autoComplete="email" className={inputClass} />
      </Field>
      <Field id="cf-phone" label={t.contactV3.phoneLabel}>
        <input id="cf-phone" name="phone" required inputMode="tel" maxLength={24} autoComplete="tel" className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="cf-message" label={t.contactV3.messageLabel}>
          <textarea id="cf-message" name="message" required rows={5} maxLength={600} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {t.contactV3.send}
        </button>
        <p className="mt-2 text-[11px] text-ink/45">{t.contactV3.sendNote}</p>
      </div>
    </form>
  );
}
