import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, MessageCircle, Tag } from 'lucide-react';
import {
  getProductBySlug,
  getAllProductSlugs,
  getCategoryBySlug,
  getStoreInfo,
  getWhatsAppLink,
} from '@/lib/sanity-data';
import { Badge } from '@/components/ui/Badge';

interface Props {
  params: Promise<{ kategori: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(({ kategori, slug }) => ({ kategori, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: product.imageUrl ? { images: [{ url: product.imageUrl }] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { kategori, slug } = await params;
  const [product, category, storeInfo] = await Promise.all([
    getProductBySlug(slug),
    getCategoryBySlug(kategori),
    getStoreInfo(),
  ]);

  if (!product || !category) notFound();

  const orderHref = product.shopeeUrl
    ? product.shopeeUrl
    : getWhatsAppLink(storeInfo.whatsapp, `Halo, saya ingin memesan ${product.name} (${product.priceDisplay})`);

  return (
    <div className="bg-[#F7F3EC] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#A8C5A0]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-[#6B7280]">
          <Link href="/katalog" className="hover:text-[#2C5F2E] transition-colors">Katalog</Link>
          <span>/</span>
          <Link href={`/katalog/${kategori}`} className="hover:text-[#2C5F2E] transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-[#2A2A2A] font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href={`/katalog/${kategori}`}
          className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#2C5F2E] text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke {category.name}
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden border border-[#A8C5A0]/30 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-[#A8C5A0]/30 to-[#2C5F2E]/10 relative">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-8xl">🌿</div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm text-[#6B7280]">{category.name}</span>
                </div>
                {product.unit && (
                  <Badge variant="green" className="mb-3">{product.unit}</Badge>
                )}
                <h1
                  className="text-2xl md:text-3xl font-bold text-[#2A2A2A] mb-4 leading-snug"
                  style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
                >
                  {product.name}
                </h1>
                <p className="text-[#6B7280] leading-relaxed mb-6">{product.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-4 h-4 text-[#2C5F2E]" />
                  <span className="text-3xl font-bold text-[#2C5F2E]">{product.priceDisplay}</span>
                  {product.unit && (
                    <span className="text-sm text-[#6B7280]">/ {product.unit}</span>
                  )}
                </div>

                <a
                  href={orderHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2C5F2E] hover:bg-[#4A8C4F] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
                >
                  {product.shopeeUrl ? (
                    <ShoppingBag className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  {product.shopeeUrl ? 'Beli di Shopee' : 'Pesan via WhatsApp'}
                </a>

                {product.shopeeUrl && (
                  <p className="text-xs text-[#6B7280] text-center mt-3">
                    Anda akan diarahkan ke halaman produk di Shopee
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
