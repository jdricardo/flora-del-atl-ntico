import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductById } from '@/lib/catalog';
import type { Product } from '@/types';

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

const WISHLIST_STORAGE_KEY = 'flora-magdalena:wishlist';

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      /** Devuelve `true` si el producto quedó en favoritos. */
      toggle: (productId) => {
        const exists = get().ids.includes(productId);
        set({ ids: exists ? get().ids.filter((id) => id !== productId) : [productId, ...get().ids] });
        return !exists;
      },

      remove: (productId) => set({ ids: get().ids.filter((id) => id !== productId) }),

      clear: () => set({ ids: [] }),
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);

/** Hook puntual: evita que toda la lista de favoritos re-renderice una tarjeta. */
export function useIsWishlisted(productId: string): boolean {
  return useWishlistStore((state) => state.ids.includes(productId));
}

/** Productos favoritos resueltos contra el catálogo, en el orden en que se agregaron. */
export function useWishlistProducts(): Product[] {
  const ids = useWishlistStore((state) => state.ids);
  return ids.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });
}
