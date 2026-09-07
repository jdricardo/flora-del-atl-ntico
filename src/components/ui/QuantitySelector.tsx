import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
  label = 'Cantidad',
  className,
}: QuantitySelectorProps) {
  const compact = size === 'sm';
  const buttonClass = cn(
    'grid place-items-center text-ink-muted transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-ink-muted',
    compact ? 'size-7' : 'size-10',
  );

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-white/60',
        compact ? 'h-7' : 'h-10',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Quitar una unidad"
      >
        <Minus className={compact ? 'size-3' : 'size-3.5'} aria-hidden="true" />
      </button>
      <span
        className={cn('min-w-6 text-center font-medium tabular-nums', compact ? 'text-xs' : 'text-sm')}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Agregar una unidad"
      >
        <Plus className={compact ? 'size-3' : 'size-3.5'} aria-hidden="true" />
      </button>
    </div>
  );
}
