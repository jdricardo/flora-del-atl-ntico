import { CATEGORY_LABELS } from '@/data/categories';
import { isOnSale } from './catalog';
import { searchProducts } from './search';
import type {
  AvailabilityFilterId,
  CatalogQuery,
  PriceBucket,
  PriceBucketId,
  Product,
  SortOption,
} from '@/types';

export const PRICE_BUCKETS: PriceBucket[] = [
  { id: 'hasta-150', label: 'Hasta $150.000', min: 0, max: 150_000 },
  { id: '150-250', label: '$150.000 – $250.000', min: 150_000, max: 250_000 },
  { id: '250-400', label: '$250.000 – $400.000', min: 250_000, max: 400_000 },
  { id: 'mas-400', label: 'Más de $400.000', min: 400_000, max: null },
];

export const AVAILABILITY_FILTERS: { id: AvailabilityFilterId; label: string }[] = [
  { id: 'en-stock', label: 'Disponible ahora' },
  { id: 'mismo-dia', label: 'Entrega el mismo día' },
  { id: 'en-promocion', label: 'En promoción' },
];

export const SORT_LABELS: Record<SortOption, string> = {
  destacados: 'Destacados',
  'mas-vendidos': 'Más vendidos',
  'precio-asc': 'Precio: menor a mayor',
  'precio-desc': 'Precio: mayor a menor',
  recientes: 'Más recientes',
};

export const DEFAULT_QUERY: CatalogQuery = {
  category: 'todos',
  priceBuckets: [],
  availability: [],
  sort: 'destacados',
  search: '',
};

function matchesPrice(product: Product, buckets: PriceBucketId[]): boolean {
  if (buckets.length === 0) return true;
  return buckets.some((id) => {
    const bucket = PRICE_BUCKETS.find((candidate) => candidate.id === id);
    if (!bucket) return false;
    return product.price >= bucket.min && (bucket.max === null || product.price < bucket.max);
  });
}

function matchesAvailability(product: Product, filters: AvailabilityFilterId[]): boolean {
  return filters.every((filter) => {
    if (filter === 'en-stock') return product.stock > 0;
    if (filter === 'mismo-dia') return product.sameDayDelivery && product.stock > 0;
    return isOnSale(product);
  });
}

const SORTERS: Record<SortOption, (a: Product, b: Product) => number> = {
  destacados: (a, b) => {
    const weight = (product: Product) => (product.badges.includes('bestseller') ? 2 : product.badges.length > 0 ? 1 : 0);
    const byBadge = weight(b) - weight(a);
    return byBadge !== 0 ? byBadge : b.salesCount - a.salesCount;
  },
  'mas-vendidos': (a, b) => b.salesCount - a.salesCount,
  'precio-asc': (a, b) => a.price - b.price,
  'precio-desc': (a, b) => b.price - a.price,
  recientes: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

/**
 * Aplica búsqueda, filtros y orden. Es una función pura: la página de tienda
 * la memoiza y el estado vive en la URL.
 */
export function applyCatalogQuery(products: Product[], query: CatalogQuery): Product[] {
  const term = query.search.trim();
  const base = term ? searchProducts(term, products) : products;

  const filtered = base.filter(
    (product) =>
      (query.category === 'todos' || product.category === query.category) &&
      matchesPrice(product, query.priceBuckets) &&
      matchesAvailability(product, query.availability),
  );

  // Con término de búsqueda y orden por defecto, respetamos el ranking de relevancia.
  if (term && query.sort === 'destacados') return filtered;

  return [...filtered].sort(SORTERS[query.sort]);
}

export function countActiveFilters(query: CatalogQuery): number {
  return (
    query.priceBuckets.length +
    query.availability.length +
    (query.category !== 'todos' ? 1 : 0) +
    (query.search.trim() ? 1 : 0)
  );
}

/** Etiquetas legibles de los filtros activos, para los chips removibles. */
export function describeActiveFilters(
  query: CatalogQuery,
): { key: string; label: string; clear: Partial<CatalogQuery> }[] {
  const chips: { key: string; label: string; clear: Partial<CatalogQuery> }[] = [];

  if (query.category !== 'todos') {
    chips.push({
      key: `category-${query.category}`,
      label: CATEGORY_LABELS[query.category],
      clear: { category: 'todos' },
    });
  }

  for (const id of query.priceBuckets) {
    const bucket = PRICE_BUCKETS.find((candidate) => candidate.id === id);
    if (bucket) {
      chips.push({
        key: `price-${id}`,
        label: bucket.label,
        clear: { priceBuckets: query.priceBuckets.filter((value) => value !== id) },
      });
    }
  }

  for (const id of query.availability) {
    const filter = AVAILABILITY_FILTERS.find((candidate) => candidate.id === id);
    if (filter) {
      chips.push({
        key: `availability-${id}`,
        label: filter.label,
        clear: { availability: query.availability.filter((value) => value !== id) },
      });
    }
  }

  if (query.search.trim()) {
    chips.push({ key: 'search', label: `“${query.search.trim()}”`, clear: { search: '' } });
  }

  return chips;
}
