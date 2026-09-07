import { cn } from '@/lib/cn';
import { discountPercent, formatCOP } from '@/lib/format';

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Oculta el porcentaje de descuento cuando ya se muestra un badge en la imagen. */
  hideDiscount?: boolean;
}

const SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
} as const;

export function Price({ price, compareAtPrice, size = 'sm', className, hideDiscount }: PriceProps) {
  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price;

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', SIZES[size], className)}>
      <span className={cn('font-medium text-ink', size === 'lg' && 'font-serif text-3xl font-normal')}>
        {formatCOP(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-ink-muted/70 line-through" aria-label="Precio anterior">
            {formatCOP(compareAtPrice)}
          </span>
          {!hideDiscount && (
            <span className="text-xs font-medium tracking-wide text-rose-600">
              −{discountPercent(compareAtPrice, price)}%
            </span>
          )}
        </>
      )}
    </p>
  );
}
