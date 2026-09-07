import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '@/types';

interface OrderState {
  /** Último pedido creado. Alimenta la página de confirmación. */
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
  clearLastOrder: () => void;
}

/**
 * Mientras no exista backend, el pedido confirmado se guarda localmente para
 * que la página de confirmación sobreviva a un refresco. Con API real esto se
 * reemplaza por `GET /api/orders/:id`.
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
      clearLastOrder: () => set({ lastOrder: null }),
    }),
    { name: 'flora-magdalena:last-order', version: 1 },
  ),
);
