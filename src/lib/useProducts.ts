import { useMemo } from 'react';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import type { Product } from '@/types';

/**
 * Hook para obtener productos activos del catálogo.
 * Usa el admin store para obtener solo productos activos.
 */
export function useProducts(): Product[] {
  const { getActiveProducts } = useAdminProductsStore();

  return useMemo(() => {
    return getActiveProducts();
  }, [getActiveProducts]);
}

/**
 * Hook para obtener un producto por ID.
 */
export function useProduct(id: string): Product | undefined {
  const { getProduct } = useAdminProductsStore();

  return useMemo(() => {
    const product = getProduct(id);
    // Solo retornar si está activo
    return product?.active ? product : undefined;
  }, [id, getProduct]);
}

/**
 * Hook para obtener productos por categoría.
 */
export function useProductsByCategory(categorySlug: string): Product[] {
  const products = useProducts();

  return useMemo(() => {
    return products.filter((p) => p.category === categorySlug);
  }, [products, categorySlug]);
}
