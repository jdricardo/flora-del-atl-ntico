import { useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import { formatCOP, pluralize } from '@/lib/format';
import { useCartStore } from '@/store/useCartStore';
import { useUiStore } from '@/store/useUiStore';
import type { CartItemOptions, Product } from '@/types';

interface AddOptions {
  quantity?: number;
  options?: Partial<CartItemOptions>;
  /** Abre el carrito lateral después de agregar (usado en "Comprar ahora"). */
  openDrawer?: boolean;
}

/**
 * Único punto de entrada para agregar al carrito: suma la línea, anima el
 * icono del header y muestra la confirmación. Evita que cada botón repita
 * esta secuencia.
 */
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const pulseCart = useUiStore((state) => state.pulseCart);
  const openPanel = useUiStore((state) => state.open);
  const { notify } = useToast();

  return useCallback(
    (product: Product, { quantity = 1, options = {}, openDrawer = false }: AddOptions = {}) => {
      const line = addItem(product, quantity, options);
      pulseCart();

      notify({
        variant: 'success',
        title: 'Agregado al carrito',
        description: `${product.name} · ${quantity} ${pluralize(quantity, 'unidad', 'unidades')} · ${formatCOP(product.price * quantity)}`,
        image: product.images[0],
        action: { label: 'Ver carrito', onClick: () => openPanel('cart') },
      });

      if (openDrawer) openPanel('cart');
      return line;
    },
    [addItem, pulseCart, notify, openPanel],
  );
}
