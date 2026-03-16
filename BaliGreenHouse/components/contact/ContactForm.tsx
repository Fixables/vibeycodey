'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getWhatsAppLink } from '@/lib/sanity-data';

interface ContactFormProps {
  whatsapp: string;
}

export function ContactForm({ whatsapp }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = `Halo Bali Greenhouse!\n\nNama: ${form.name}\nNo. HP: ${form.phone}\n\nPesan:\n${form.message}`;
    window.open(getWhatsAppLink(whatsapp, text), '_blank');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2C5F2E] mb-6" style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}>
        Kirim Pesan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5" htmlFor="name">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-2.5 bg-white border border-[#A8C5A0]/50 rounded-xl text-sm text-[#2A2A2A] placeholder-[#6B7280] focus:outline-none focus:border-[#2C5F2E] focus:ring-1 focus:ring-[#2C5F2E] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5" htmlFor="phone">
            Nomor WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Contoh: 081234567890"
            className="w-full px-4 py-2.5 bg-white border border-[#A8C5A0]/50 rounded-xl text-sm text-[#2A2A2A] placeholder-[#6B7280] focus:outline-none focus:border-[#2C5F2E] focus:ring-1 focus:ring-[#2C5F2E] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5" htmlFor="message">
            Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Tulis pertanyaan atau pesanan Anda di sini..."
            className="w-full px-4 py-2.5 bg-white border border-[#A8C5A0]/50 rounded-xl text-sm text-[#2A2A2A] placeholder-[#6B7280] focus:outline-none focus:border-[#2C5F2E] focus:ring-1 focus:ring-[#2C5F2E] transition-colors resize-none"
          />
        </div>
        <Button type="submit" variant="primary" size="md" className="w-full gap-2">
          <Send className="w-4 h-4" />
          Kirim via WhatsApp
        </Button>
        <p className="text-center text-xs text-[#6B7280]">Pesan akan dikirim melalui WhatsApp</p>
      </form>
    </div>
  );
}
