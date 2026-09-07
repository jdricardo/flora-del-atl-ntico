import { useEffect, useState } from 'react';

/**
 * Simula la latencia de una API para que los skeletons tengan sentido.
 * Cuando exista backend, este hook se reemplaza por React Query / SWR
 * conservando la misma firma `{ data, isLoading }`.
 */
export function useDeferredCatalog<T>(data: T, delay = 550): { data: T; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
    // Solo la primera carga de cada montaje muestra skeleton.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
}
