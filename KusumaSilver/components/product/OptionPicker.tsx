'use client';

import type { TaxonomyTerm } from '@/types';

interface OptionPickerProps {
  label: string;
  options: TaxonomyTerm[];
  selected: string | null;
  onSelect: (slug: string) => void;
  /** Suffix for a sold-out option, e.g. "sold out". */
  soldOutLabel: string;
}

/**
 * A row of choices — gemstones or sizes — on the piece page.
 *
 * Sold-out options stay visible but disabled rather than disappearing: a ring
 * offered in five stones should still look like a ring offered in five stones
 * when one runs out, and a shopper who cannot see the option cannot ask about it.
 * They are struck through and dimmed, and carry the reason in their accessible
 * name so it is not conveyed by styling alone.
 */
export function OptionPicker({
  label,
  options,
  selected,
  onSelect,
  soldOutLabel,
}: OptionPickerProps) {
  if (options.length === 0) return null;

  // A single option is a statement, not a choice.
  if (options.length === 1) {
    const only = options[0];
    return (
      <div className="mt-6 w-full">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">{label}</p>
        <p className="mt-2 text-sm text-ink">
          {only.label}
          {!only.inStock && <span className="ml-2 text-ink/45">· {soldOutLabel}</span>}
        </p>
      </div>
    );
  }

  return (
    <fieldset className="mt-6 w-full">
      <legend className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.slug;
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => onSelect(option.slug)}
              disabled={!option.inStock}
              aria-pressed={isSelected}
              aria-label={option.inStock ? undefined : `${option.label} — ${soldOutLabel}`}
              className={`min-h-11 min-w-11 border border-ink px-4 text-[13px] transition-colors ${
                option.inStock
                  ? isSelected
                    ? 'cursor-pointer bg-ink text-paper'
                    : 'cursor-pointer bg-transparent text-ink hover:bg-ink/5'
                  : 'cursor-not-allowed border-ink/25 text-ink/30 line-through'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
