import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import type { CategorySlug, Product } from '@/types';

/**
 * Obtener productos activos del store.
 * NOTA: Esta función debe usarse con cuidado fuera de componentes React.
 * Para componentes, usar el hook useProducts() en su lugar.
 */
function getProducts(): Product[] {
  const store = useAdminProductsStore.getState();
  return store.getActiveProducts();
}

/** Índice por id para lookups O(1) desde el carrito y la ficha de producto. */
function getById() {
  const products = getProducts();
  return new Map<string, Product>(products.map((product) => [product.id, product]));
}

export function getAllProducts(): Product[] {
  return getProducts();
}

export function getProductById(id: string | undefined): Product | undefined {
  if (!id) return undefined;
  const BY_ID = getById();
  return BY_ID.get(id);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  const PRODUCTS = getProducts();
  return PRODUCTS.filter((product) => product.category === category);
}

export function isInStock(product: Product): boolean {
  return product.stock > 0;
}

export function isOnSale(product: Product): boolean {
  return typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price;
}

/** Destacados de la home: primero los bestsellers, luego por unidades vendidas. */
export function getFeaturedProducts(limit = 8): Product[] {
  const PRODUCTS = getProducts();
  return [...PRODUCTS]
    .sort((a, b) => {
      const weight = (product: Product) => (product.badges.includes('bestseller') ? 1 : 0);
      const byBadge = weight(b) - weight(a);
      return byBadge !== 0 ? byBadge : b.salesCount - a.salesCount;
    })
    .slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  const PRODUCTS = getProducts();
  return [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

/**
 * Relacionados: misma categoría primero y, si no alcanzan, se completa con
 * productos que comparten etiquetas.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const PRODUCTS = getProducts();
  const sameCategory = PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category);

  if (sameCategory.length >= limit) {
    return sameCategory.sort((a, b) => b.salesCount - a.salesCount).slice(0, limit);
  }

  const tags = new Set(product.tags);
  const byTag = PRODUCTS.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category &&
      item.tags.some((tag) => tags.has(tag)),
  );

  return [...sameCategory, ...byTag].slice(0, limit);
}

export function getPriceRange(): { min: number; max: number } {
  const prices = PRODUCTS.map((product) => product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
