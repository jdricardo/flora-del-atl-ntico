import type { CartItemOptions } from '@/types';

function shortHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Identificador de línea del carrito. El mismo producto con las mismas
 * opciones cae en la misma línea (suma cantidad); con opciones distintas
 * genera una línea nueva, porque son entregas diferentes.
 */
export function createLineId(productId: string, options: CartItemOptions): string {
  const signature = [
    options.deliveryDate ?? '',
    options.cityId ?? '',
    options.dedication.trim(),
    options.giftCard ? '1' : '0',
  ].join('|');
  return `${productId}__${shortHash(signature)}`;
}

export function createOrderId(now: Date = new Date()): string {
  const stamp = [
    `${now.getFullYear()}`.slice(2),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
  ].join('');
  const random = Math.floor(Math.random() * 46_656)
    .toString(36)
    .padStart(3, '0')
    .toUpperCase();
  return `FM-${stamp}-${random}`;
}

let counter = 0;

/** Id efímero para toasts y elementos de UI. */
export function uid(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}
