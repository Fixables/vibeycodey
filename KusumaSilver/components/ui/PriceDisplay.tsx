'use client';

import { useCurrency } from '@/components/providers/CurrencyProvider';
import { formatDisplayPrice } from '@/lib/commerce/config';

interface PriceDisplayProps {
  amountIdr: number;
  className?: string;
}

export function PriceDisplay({ amountIdr, className }: PriceDisplayProps) {
  const { currency } = useCurrency();
  return <span className={className}>{formatDisplayPrice(amountIdr, currency)}</span>;
}
