import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_QUERY, PRICE_BUCKETS, AVAILABILITY_FILTERS } from '@/lib/filters';
import { CATEGORY_SLUGS, SORT_OPTIONS } from '@/types';
import type {
  AvailabilityFilterId,
  CatalogQuery,
  CategorySlug,
  PriceBucketId,
  SortOption,
} from '@/types';

/** Nombres de los parámetros en la URL, en español para que sean compartibles. */
const PARAM = {
  category: 'categoria',
  price: 'precio',
  availability: 'disponibilidad',
  sort: 'orden',
  search: 'q',
} as const;

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  return raw.split(',').filter((value): value is T => (allowed as readonly string[]).includes(value));
}

/**
 * El estado de los filtros vive en la URL: se puede compartir, volver atrás
 * con el navegador y recargar sin perder la selección.
 */
export function useCatalogQuery() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<CatalogQuery>(() => {
    const rawCategory = params.get(PARAM.category);
    const category: CategorySlug | 'todos' =
      rawCategory && (CATEGORY_SLUGS as readonly string[]).includes(rawCategory)
        ? (rawCategory as CategorySlug)
        : 'todos';

    const rawSort = params.get(PARAM.sort);
    const sort: SortOption = (SORT_OPTIONS as readonly string[]).includes(rawSort ?? '')
      ? (rawSort as SortOption)
      : DEFAULT_QUERY.sort;

    return {
      category,
      sort,
      priceBuckets: parseList<PriceBucketId>(
        params.get(PARAM.price),
        PRICE_BUCKETS.map((bucket) => bucket.id),
      ),
      availability: parseList<AvailabilityFilterId>(
        params.get(PARAM.availability),
        AVAILABILITY_FILTERS.map((filter) => filter.id),
      ),
      search: params.get(PARAM.search) ?? '',
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<CatalogQuery>) => {
      const next = { ...query, ...patch };
      const search = new URLSearchParams();

      if (next.category !== 'todos') search.set(PARAM.category, next.category);
      if (next.priceBuckets.length) search.set(PARAM.price, next.priceBuckets.join(','));
      if (next.availability.length) search.set(PARAM.availability, next.availability.join(','));
      if (next.sort !== DEFAULT_QUERY.sort) search.set(PARAM.sort, next.sort);
      if (next.search.trim()) search.set(PARAM.search, next.search.trim());

      setParams(search, { replace: true, preventScrollReset: true });
    },
    [query, setParams],
  );

  const toggleInList = useCallback(
    <T extends string>(key: 'priceBuckets' | 'availability', value: T) => {
      const current = query[key] as T[];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      update({ [key]: next } as Partial<CatalogQuery>);
    },
    [query, update],
  );

  const reset = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
  }, [setParams]);

  return { query, update, toggleInList, reset };
}
