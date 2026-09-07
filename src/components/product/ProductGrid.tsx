import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  /** Columnas en desktop. Móvil siempre 2. */
  columns?: 3 | 4;
  emptyState?: ReactNode;
  skeletonCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
  emptyState,
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton count={skeletonCount} />;

  if (products.length === 0) {
    return (
      emptyState ?? (
        <EmptyState
          icon="sprout"
          title="Todavía no hay nada por aquí"
          description="Prueba ajustando los filtros o explora la colección completa."
        />
      )
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14',
        columns === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
