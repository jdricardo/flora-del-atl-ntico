import { Truck } from 'lucide-react';
import { SHIPPING } from '@/data/site';
import { cityName } from '@/data/cities';
import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { CartTotals } from '@/types';

interface CartSummaryProps {
  totals: CartTotals;
  cityId: string | null;
  className?: string;
  /** Muestra la barra de progreso hacia el envío gratis. */
  showProgress?: boolean;
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className={muted ? 'text-ink-muted' : undefined}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function CartSummary({ totals, cityId, className, showProgress = true }: CartSummaryProps) {
  const progress = Math.min(100, ((SHIPPING.freeThreshold - totals.freeShippingRemaining) / SHIPPING.freeThreshold) * 100);
  const isFree = totals.freeShippingRemaining === 0;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {showProgress && (
        <div className="mb-1 flex flex-col gap-2">
          <p className="flex items-center gap-2 text-xs text-ink-muted">
            <Truck className="size-3.5 shrink-0" aria-hidden="true" />
            {isFree ? (
              <span className="font-medium text-olive-600">Tu envío es gratis</span>
            ) : (
              <span>
                Te faltan <strong className="font-medium text-ink">{formatCOP(totals.freeShippingRemaining)}</strong>{' '}
                para el envío gratis
              </span>
            )}
          </p>
          <div className="h-1 overflow-hidden rounded-full bg-sand" role="presentation">
            <div
              className="h-full rounded-full bg-olive-400 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Row label="Subtotal" value={formatCOP(totals.subtotal)} muted />
      {totals.giftCards > 0 && <Row label="Tarjetas manuscritas" value={formatCOP(totals.giftCards)} muted />}
      <Row
        label={cityId ? `Envío · ${cityName(cityId)}` : 'Envío (estimado)'}
        value={totals.shipping === 0 ? 'Gratis' : formatCOP(totals.shipping)}
        muted
      />

      <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <span className="text-[0.72rem] tracking-[0.14em] uppercase">Total</span>
        <span className="font-serif text-2xl tabular-nums">{formatCOP(totals.total)}</span>
      </div>
    </div>
  );
}
