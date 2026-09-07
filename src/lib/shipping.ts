import { getCity } from '@/data/cities';
import { GIFT_CARD_PRICE, SHIPPING } from '@/data/site';
import type { CartItem, CartTotals } from '@/types';

export function lineSubtotal(item: CartItem): number {
  return item.product.price * item.quantity;
}

export function lineTotal(item: CartItem): number {
  return lineSubtotal(item) + (item.options.giftCard ? GIFT_CARD_PRICE * item.quantity : 0);
}

/**
 * Costo de envío. Es una sola función para que el drawer, el checkout y el
 * resumen del pedido nunca puedan mostrar cifras distintas.
 */
export function shippingCost(subtotal: number, cityId: string | null): number {
  if (subtotal === 0) return 0;
  if (subtotal >= SHIPPING.freeThreshold) return 0;
  return getCity(cityId)?.shippingCost ?? SHIPPING.defaultCost;
}

export function calculateTotals(items: CartItem[], cityId: string | null): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + lineSubtotal(item), 0);
  const giftCards = items.reduce(
    (sum, item) => sum + (item.options.giftCard ? GIFT_CARD_PRICE * item.quantity : 0),
    0,
  );
  const merchandise = subtotal + giftCards;
  const shipping = shippingCost(merchandise, cityId);

  return {
    subtotal,
    giftCards,
    shipping,
    total: merchandise + shipping,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    freeShippingRemaining: Math.max(0, SHIPPING.freeThreshold - merchandise),
  };
}
