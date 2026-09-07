import { create } from 'zustand';

type Panel = 'cart' | 'search' | 'menu' | 'filters' | 'city';

interface UiState {
  openPanel: Panel | null;
  /** Se incrementa al agregar al carrito para animar el icono del header. */
  cartPulse: number;
  open: (panel: Panel) => void;
  close: () => void;
  toggle: (panel: Panel) => void;
  pulseCart: () => void;
}

/**
 * Un único panel abierto a la vez: evita que el carrito, el buscador y el
 * menú móvil se solapen y simplifica el bloqueo del scroll.
 */
export const useUiStore = create<UiState>((set, get) => ({
  openPanel: null,
  cartPulse: 0,
  open: (panel) => set({ openPanel: panel }),
  close: () => set({ openPanel: null }),
  toggle: (panel) => set({ openPanel: get().openPanel === panel ? null : panel }),
  pulseCart: () => set({ cartPulse: get().cartPulse + 1 }),
}));

export const useIsPanelOpen = (panel: Panel): boolean =>
  useUiStore((state) => state.openPanel === panel);
