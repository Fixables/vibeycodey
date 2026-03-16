'use client';

import { Search } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({ value, onChange, placeholder = 'Cari produk...' }: SearchFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#A8C5A0]/50 rounded-xl text-sm text-[#2A2A2A] placeholder-[#6B7280] focus:outline-none focus:border-[#2C5F2E] focus:ring-1 focus:ring-[#2C5F2E] transition-colors"
      />
    </div>
  );
}
