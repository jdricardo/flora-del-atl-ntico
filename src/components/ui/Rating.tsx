import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function Rating({ value, reviewCount, size = 'sm', className }: RatingProps) {
  const rounded = Math.round(value);
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-0.5" role="img" aria-label={`${value} de 5 estrellas`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(starSize, index < rounded ? 'fill-gold text-gold' : 'fill-none text-clay')}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ))}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-muted">
          {value.toFixed(1)} · {reviewCount} opiniones
        </span>
      )}
    </div>
  );
}
