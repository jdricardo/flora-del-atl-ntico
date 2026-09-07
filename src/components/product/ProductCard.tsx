import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { CATEGORY_LABELS } from '@/data/categories';
import { discountPercent } from '@/lib/format';
import { cn } from '@/lib/cn';
import { isInStock, isOnSale } from '@/lib/catalog';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Badge, ProductBadges } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { WishlistButton } from './WishlistButton';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** Prioriza la carga de las primeras imágenes visibles (LCP). */
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const addToCart = useAddToCart();
  const available = isInStock(product);
  const onSale = isOnSale(product);
  const href = `/producto/${product.id}`;
  const hoverImage = product.images[1];

  return (
    <article className={cn('group flex flex-col', className)}>
      <div className="relative overflow-hidden rounded-xl bg-cream">
        <Link
          to={href}
          className="block focus-visible:outline-offset-[-4px]"
          aria-label={`Ver ${product.name}`}
          tabIndex={-1}
        >
          <div className="grain relative aspect-4/5 overflow-hidden">
            <img
              src={product.images[0]}
              alt={`${product.name} — ${product.shortDescription}`}
              width={800}
              height={1000}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className={cn(
                'size-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]',
              )}
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt=""
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                className="absolute inset-0 size-full scale-[1.03] object-cover opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
              />
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="pointer-events-auto flex flex-col items-start gap-1.5">
            <ProductBadges badges={product.badges} />
            {onSale && product.compareAtPrice && (
              <Badge tone="rose">−{discountPercent(product.compareAtPrice, product.price)}%</Badge>
            )}
            {!available && <Badge tone="muted">Agotado</Badge>}
          </div>
          <div className="pointer-events-auto">
            <WishlistButton product={product} />
          </div>
        </div>

        {/* Acciones: siempre visibles en móvil, al pasar el cursor en desktop. */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!available}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ivory/95 text-[0.7rem] font-medium tracking-[0.12em] text-ink uppercase backdrop-blur-sm transition-colors hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ivory/95 disabled:hover:text-ink"
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
            {available ? 'Agregar' : 'Agotado'}
          </button>
          <Link
            to={href}
            aria-label={`Ver detalle de ${product.name}`}
            title="Ver producto"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ivory/95 text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-ivory"
          >
            <Eye className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <span className="eyebrow">{CATEGORY_LABELS[product.category]}</span>
        <h3 className="text-lg leading-tight">
          <Link to={href} className="link-underline relative transition-colors hover:text-olive-600">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} hideDiscount className="mt-auto pt-1" />
      </div>
    </article>
  );
}
