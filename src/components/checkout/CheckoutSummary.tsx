import { Link } from 'react-router-dom';
import { GIFT_CARD_PRICE } from '@/data/site';
import { formatCOP, truncate } from '@/lib/format';
import { lineSubtotal } from '@/lib/shipping';
import { CartSummary } from '@/components/cart/CartSummary';
import type { CartItem, CartTotals } from '@/types';

interface CheckoutSummaryProps {
  items: CartItem[];
  totals: CartTotals;
  cityId: string | null;
  /** En la confirmación el resumen es solo lectura. */
  readOnly?: boolean;
}

export function CheckoutSummary({ items, totals, cityId, readOnly = false }: CheckoutSummaryProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-cream/40 p-6">
      <h2 className="font-serif text-xl">Resumen del pedido</h2>

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.lineId} className="flex gap-3">
            <img
              src={item.product.images[0]}
              alt=""
              width={56}
              height={70}
              loading="lazy"
              className="h-[4.375rem] w-14 shrink-0 rounded-md bg-cream object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {readOnly ? (
                  item.product.name
                ) : (
                  <Link to={`/producto/${item.product.id}`} className="hover:text-olive-600">
                    {item.product.name}
                  </Link>
                )}
              </p>
              <p className="text-xs text-ink-muted">
                Cantidad {item.quantity}
                {item.options.giftCard && ` · tarjeta ${formatCOP(GIFT_CARD_PRICE)}`}
              </p>
              {item.options.dedication && (
                <p className="mt-0.5 truncate text-xs text-ink-muted italic">
                  “{truncate(item.options.dedication, 40)}”
                </p>
              )}
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatCOP(lineSubtotal(item))}</p>
          </li>
        ))}
      </ul>

      <div className="border-t border-line pt-5">
        <CartSummary totals={totals} cityId={cityId} showProgress={!readOnly} />
      </div>
    </div>
  );
}
