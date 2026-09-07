import { Navigate, useParams } from 'react-router-dom';
import { Check, Package, Truck } from 'lucide-react';
import { CATEGORY_LABELS } from '@/data/categories';
import { getProductById } from '@/lib/catalog';
import { pluralize } from '@/lib/format';
import { useSeo } from '@/hooks/useSeo';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Price } from '@/components/ui/Price';
import { Rating } from '@/components/ui/Rating';
import { ProductBadges } from '@/components/ui/Badge';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfoTabs } from '@/components/product/ProductInfoTabs';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { RelatedProducts } from '@/components/product/RelatedProducts';

const ASSURANCES = [
  { icon: Truck, text: 'Entrega el mismo día en ciudades con cobertura' },
  { icon: Package, text: 'Empaque de regalo y dedicatoria incluidos' },
  { icon: Check, text: 'Reposición sin costo si llega en mal estado' },
];

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  useSeo({
    title: product ? `${product.name} · ${CATEGORY_LABELS[product.category]}` : 'Producto no encontrado',
    description: product?.shortDescription,
    path: product ? `/producto/${product.id}` : '/tienda',
    image: product?.images[0],
    type: 'product',
    noindex: !product,
  });

  if (!product) return <Navigate to="/tienda" replace />;

  const lowStock = product.stock > 0 && product.stock <= 6;

  return (
    <>
      <Container className="pt-8 pb-16 lg:pt-10 lg:pb-24">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Tienda', to: '/tienda' },
            { label: CATEGORY_LABELS[product.category], to: `/tienda?categoria=${product.category}` },
            { label: product.name },
          ]}
          className="mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ProductGallery key={product.id} images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">
                  Colección {product.collection} · {CATEGORY_LABELS[product.category]}
                </span>
                <ProductBadges badges={product.badges} />
              </div>

              <h1 className="text-4xl leading-tight sm:text-5xl">{product.name}</h1>
              <Rating value={product.rating} reviewCount={product.reviewCount} />
            </div>

            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />

            <p className="max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">{product.shortDescription}</p>

            <p className="flex items-center gap-2 text-xs">
              <span
                className={`size-1.5 rounded-full ${product.stock > 0 ? 'bg-olive-500' : 'bg-clay'}`}
                aria-hidden="true"
              />
              {product.stock > 0 ? (
                <span className={lowStock ? 'font-medium text-gold' : 'text-ink-muted'}>
                  {lowStock
                    ? `Quedan ${product.stock} ${pluralize(product.stock, 'unidad', 'unidades')}`
                    : 'Disponible para envío'}
                </span>
              ) : (
                <span className="text-ink-muted">Agotado por ahora · escríbenos y te avisamos</span>
              )}
              <span className="text-ink-muted/70">· SKU {product.sku}</span>
            </p>

            <PurchasePanel product={product} />

            <ul className="flex flex-col gap-2.5 rounded-xl bg-cream/60 p-5">
              {ASSURANCES.map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-xs text-ink-muted">
                  <item.icon className="size-4 shrink-0 text-olive-500" aria-hidden="true" strokeWidth={1.6} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <ProductInfoTabs product={product} />
        </div>
      </Container>

      <RelatedProducts product={product} />
    </>
  );
}
