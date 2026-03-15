import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getFeaturedProducts } from '@/data/products';
import { getWhatsAppLink } from '@/data/store';

export function FeaturedProducts() {
  const featured = getFeaturedProducts().slice(0, 6);
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Produk Unggulan"
          subtitle="Pilihan terbaik dari koleksi kami yang paling diminati"
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Card key={product.id} hover className="overflow-hidden">
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
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">🌿</div>
                )}
              </div>
              <div className="p-5">
                <Badge variant="green" className="mb-2">{product.unit}</Badge>
                <h3 className="font-bold text-[#2A2A2A] text-base mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2C5F2E] font-bold text-lg">{product.priceDisplay}</span>
                  <Button
                    as="a"
                    href={getWhatsAppLink(`Halo, saya ingin memesan ${product.name}`)}
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
          ))}
        </div>
        <div className="text-center mt-10">
          <Button as="a" href="/katalog" variant="outline" size="md" className="gap-2">
            Lihat Semua Produk <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
