import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lleva el scroll arriba al cambiar de página, pero no cuando solo cambian
 * los parámetros de búsqueda (filtros de la tienda).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
