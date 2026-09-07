import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Bloquea el scroll de la página mientras un panel modal está abierto. */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [active]);
}

/** Cierra con Escape. */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, onEscape]);
}

/**
 * Mantiene el foco dentro del panel y lo devuelve al elemento que lo abrió.
 * Requisito de accesibilidad para diálogos modales.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active || !ref.current) return;

    const panel = ref.current;
    const opener = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables()[0];
    (first ?? panel).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;

      const start = items[0];
      const end = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === start || current === panel)) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && current === end) {
        event.preventDefault();
        start.focus();
      }
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      opener?.focus?.({ preventScroll: true });
    };
  }, [ref, active]);
}
