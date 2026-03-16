import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';

const SHOPEE_STORE_URL = 'https://shopee.co.id/baligreenhouse278';

interface ProductCardProps {
  product: Product;
  whatsapp: string;
}

export function ProductCard({ product }: ProductCardProps) {
  const detailHref = `/katalog/${product.category}/${product.slug}`;
  const orderHref = product.shopeeUrl ?? SHOPEE_STORE_URL;

  return (
    <Card hover className="overflow-hidden">
      <Link href={detailHref} className="block">
        <div className="aspect-square bg-gradient-to-br from-[#A8C5A0]/30 to-[#2C5F2E]/10 relative overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              🌿
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        {product.unit && (
          <Badge variant="green" className="mb-2">{product.unit}</Badge>
        )}
        <Link href={detailHref}>
          <h3 className="font-bold text-[#2A2A2A] text-base mb-1 line-clamp-2 hover:text-[#2C5F2E] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1">{product.description}</p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-[#2C5F2E] font-bold text-lg">{product.priceDisplay}</span>
          <Button
            as="a"
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="primary"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pesan
          </Button>
        </div>
      </div>
    </Card>
  );
}
