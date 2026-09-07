import { cn } from '@/lib/cn';

/** Bloque de carga. Reutiliza la animación `shimmer` del tema. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded-md bg-cream', className)} aria-hidden="true" />;
}

/** Skeleton con la misma proporción y ritmo que ProductCard. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-4/5 w-full rounded-xl" />
      <Skeleton className="h-2.5 w-20" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3.5 w-24" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
      aria-label="Cargando productos"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
