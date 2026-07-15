'use client';

import { useState } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  label: string;
}

export function SizeSelector({ sizes, label }: SizeSelectorProps) {
  const [selected, setSelected] = useState(sizes[0]);

  if (sizes.length === 0) return null;

  if (sizes.length === 1) {
    return (
      <div className="mt-6 w-full">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">{label}</p>
        <p className="mt-2 text-sm text-ink">{sizes[0]}</p>
      </div>
    );
  }

  return (
    <fieldset className="mt-6 w-full">
      <legend className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelected(size)}
            aria-pressed={selected === size}
            className={`min-h-11 min-w-11 cursor-pointer border border-ink px-4 text-[13px] transition-colors ${
              selected === size ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
