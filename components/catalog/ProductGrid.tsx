import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = 'Tidak ada produk ditemukan.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-[#6B7280]">
        <div className="text-5xl mb-4">🔍</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
