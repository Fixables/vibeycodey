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

function ShopeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C12.13 2 9 4.91 9 8.5c0 .35.03.69.09 1.02C5.6 10.22 3 13.3 3 17v11a1 1 0 0 0 1 1h24a1 1 0 0 0 1-1V17c0-3.7-2.6-6.78-6.09-7.48.06-.33.09-.67.09-1.02C23 4.91 19.87 2 16 2zm0 2.5c2.21 0 4.5 1.34 4.5 4S18.21 13 16 13s-4.5-1.34-4.5-4 2.29-4.5 4.5-4.5zM11 17.5a5 5 0 0 1 10 0v1H11v-1zm-2 3.5h14v5H9v-5z"/>
    </svg>
  );
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {product.shopeeUrl && (
              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Beli di Shopee"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                <ShopeeIcon className="w-4 h-4 text-white" />
              </a>
            )}
            <Button
              as="a"
              href={getWhatsAppLink(whatsapp, `Halo, saya ingin memesan ${product.name} (${product.priceDisplay})`)}
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
      </div>
    </Card>
  );
}
