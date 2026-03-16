'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getT } from '@/lib/i18n';
import { getWhatsAppLink } from '@/lib/sanity-data';
import type { Locale } from '@/types';

interface ContactFormProps {
  locale: Locale;
  whatsapp: string;
}

export function ContactForm({ locale, whatsapp }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const t = getT(locale);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text =
      locale === 'en'
        ? `Hello, my name is ${name} (${phone}). ${message}`
        : `Halo, nama saya ${name} (${phone}). ${message}`;
    const link = getWhatsAppLink(whatsapp, text);
    window.open(link, '_blank');
  }

  const inputClass =
    'w-full rounded-xl border border-ivory-dark bg-ivory px-4 py-3 text-sm text-text outline-none transition-colors focus:border-espresso placeholder:text-stone';

  return (
    <div className="rounded-2xl border border-ivory-dark bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-espresso mb-4">
        {locale === 'en' ? 'Send Us a Message' : 'Kirim Pesan'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.contact.namePlaceholder}
          required
          className={inputClass}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t.contact.phonePlaceholder}
          required
          className={inputClass}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.contact.messagePlaceholder}
          required
          rows={5}
          className={inputClass}
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#20b958]"
        >
          <MessageCircle size={18} />
          {t.contact.sendButton}
        </button>
      </form>
    </div>
  );
}
