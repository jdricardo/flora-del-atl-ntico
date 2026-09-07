import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, PenLine, Trash2 } from 'lucide-react';
import { cityName } from '@/data/cities';
import { GIFT_CARD_PRICE } from '@/data/site';
import { formatShortDate } from '@/lib/dates';
import { formatCOP, truncate } from '@/lib/format';
import { lineTotal } from '@/lib/shipping';
import { MAX_UNITS_PER_LINE, useCartStore } from '@/store/useCartStore';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import type { CartItem } from '@/types';

interface CartLineProps {
  item: CartItem;
  onNavigate?: () => void;
}

export function CartLine({ item, onNavigate }: CartLineProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { product, options } = item;

  const maxUnits = Math.max(1, Math.min(MAX_UNITS_PER_LINE, product.stock));

  return (
    <li className="animate-fade-in flex gap-4 py-5">
      <Link
        to={`/producto/${product.id}`}
        onClick={onNavigate}
        className="shrink-0 overflow-hidden rounded-lg bg-cream"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={product.images[0]}
          alt=""
          width={80}
          height={100}
          loading="lazy"
          className="h-25 w-20 object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg leading-tight">
            <Link to={`/producto/${product.id}`} onClick={onNavigate} className="hover:text-olive-600">
              {product.name}
            </Link>
          </h3>
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            aria-label={`Eliminar ${product.name} del carrito`}
            className="-mt-1 grid size-8 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-ink-muted">{formatCOP(product.price)} c/u</p>

        {(options.deliveryDate || options.cityId || options.dedication || options.giftCard) && (
          <ul className="flex flex-col gap-0.5 text-[0.7rem] text-ink-muted">
            {options.deliveryDate && (
              <li className="flex items-center gap-1.5">
                <CalendarDays className="size-3" aria-hidden="true" />
                Entrega {formatShortDate(options.deliveryDate)}
              </li>
            )}
            {options.cityId && (
              <li className="flex items-center gap-1.5">
                <MapPin className="size-3" aria-hidden="true" />
                {cityName(options.cityId)}
              </li>
            )}
            {options.dedication && (
              <li className="flex items-start gap-1.5">
                <PenLine className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span className="italic">“{truncate(options.dedication, 48)}”</span>
              </li>
            )}
            {options.giftCard && <li className="pl-4.5">+ Tarjeta manuscrita {formatCOP(GIFT_CARD_PRICE)}</li>}
          </ul>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(quantity) => setQuantity(item.lineId, quantity)}
            max={maxUnits}
            size="sm"
            label={`Cantidad de ${product.name}`}
          />
          <p className="text-sm font-medium tabular-nums">{formatCOP(lineTotal(item))}</p>
        </div>
      </div>
    </li>
  );
}
