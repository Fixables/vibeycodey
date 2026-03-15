import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { getWhatsAppLink } from '@/lib/sanity-data';

interface ProductCardProps {
  product: Product;
  whatsapp: string;
}

export function ProductCard({ product, whatsapp }: ProductCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-[#A8C5A0]/30 to-[#2C5F2E]/10 relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🌿
          </div>
        )}
      </div>
      <div className="p-5">
        {product.unit && (
          <Badge variant="green" className="mb-2">{product.unit}</Badge>
        )}
        <h3 className="font-bold text-[#2A2A2A] text-base mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-[#6B7280] text-sm mb-4 line-clamp-3">{product.description}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#2C5F2E] font-bold text-lg">{product.priceDisplay}</span>
          <Button
            as="a"
            href={getWhatsAppLink(whatsapp, `Halo, saya ingin memesan ${product.name} (${product.priceDisplay})`)}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="primary"
            className="flex-shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pesan
          </Button>
        </div>
      </div>
    </Card>
  );
}
