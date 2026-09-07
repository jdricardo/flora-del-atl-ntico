import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CITY_ID } from '@/data/cities';
import { getProductById } from '@/lib/catalog';
import { createLineId } from '@/lib/id';
import { calculateTotals } from '@/lib/shipping';
import type { CartItem, CartItemOptions, CartTotals, Product } from '@/types';

export const MAX_UNITS_PER_LINE = 20;

export function defaultCartOptions(overrides: Partial<CartItemOptions> = {}): CartItemOptions {
  return { deliveryDate: null, cityId: null, dedication: '', giftCard: false, ...overrides };
}

interface CartState {
  items: CartItem[];
  /** Ciudad de entrega elegida en el modal; alimenta el cálculo de envío. */
  cityId: string | null;
  addItem: (product: Product, quantity?: number, options?: Partial<CartItemOptions>) => CartItem;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  updateOptions: (lineId: string, patch: Partial<CartItemOptions>) => void;
  setCityId: (cityId: string | null) => void;
  clear: () => void;
}

const CART_STORAGE_KEY = 'flora-magdalena:cart';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cityId: null,

      addItem: (product, quantity = 1, options = {}) => {
        const resolved = defaultCartOptions({ cityId: get().cityId, ...options });
        const lineId = createLineId(product.id, resolved);
        const existing = get().items.find((item) => item.lineId === lineId);

        const nextQuantity = Math.min(MAX_UNITS_PER_LINE, (existing?.quantity ?? 0) + quantity);
        const line: CartItem = { lineId, product, quantity: nextQuantity, options: resolved };

        set({
          items: existing
            ? get().items.map((item) => (item.lineId === lineId ? line : item))
            : [...get().items, line],
        });

        return line;
      },

      removeItem: (lineId) => set({ items: get().items.filter((item) => item.lineId !== lineId) }),

      setQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: Math.min(MAX_UNITS_PER_LINE, Math.min(quantity, item.product.stock)) }
              : item,
          ),
        });
      },

      updateOptions: (lineId, patch) =>
        set({
          items: get().items.map((item) => {
            if (item.lineId !== lineId) return item;
            const options = { ...item.options, ...patch };
            return { ...item, options, lineId: createLineId(item.product.id, options) };
          }),
        }),

      setCityId: (cityId) => set({ cityId }),

      clear: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ items: state.items, cityId: state.cityId }),
      /**
       * Al rehidratar se vuelve a leer el producto del catálogo: así el
       * carrito guardado nunca muestra precios o stock desactualizados, y las
       * líneas de productos que ya no existen se descartan solas.
       */
      merge: (persisted, current) => {
        const saved = persisted as Partial<CartState> | undefined;
        const items = (saved?.items ?? []).flatMap<CartItem>((item) => {
          const product = getProductById(item?.product?.id);
          if (!product) return [];
          return [{ ...item, product, quantity: Math.min(item.quantity, product.stock || 1) }];
        });
        return { ...current, ...saved, items };
      },
    },
  ),
);

/* ---------------------------- selectores ---------------------------- */

export const selectItems = (state: CartState) => state.items;
export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

/** Totales derivados. Se calcula fuera del store para no duplicar estado. */
export function useCartTotals(): CartTotals {
  const items = useCartStore(selectItems);
  const cityId = useCartStore((state) => state.cityId ?? DEFAULT_CITY_ID);
  return calculateTotals(items, cityId);
}
