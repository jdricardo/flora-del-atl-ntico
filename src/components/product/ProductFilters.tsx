import { X } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { AVAILABILITY_FILTERS, PRICE_BUCKETS, SORT_LABELS, countActiveFilters, describeActiveFilters } from '@/lib/filters';
import { SORT_OPTIONS } from '@/types';
import { cn } from '@/lib/cn';
import { Checkbox, Select } from '@/components/ui/Field';
import type { CatalogQuery, SortOption } from '@/types';

interface FiltersProps {
  query: CatalogQuery;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onToggle: (key: 'priceBuckets' | 'availability', value: string) => void;
  onReset: () => void;
  /** Cantidad de resultados, para mostrarla dentro del drawer móvil. */
  resultCount?: number;
  idPrefix?: string;
}

/** Pestañas de categoría: “Todos” más las cuatro categorías. */
export function CategoryTabs({ query, onChange }: Pick<FiltersProps, 'query' | 'onChange'>) {
  const options: { value: CatalogQuery['category']; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    ...CATEGORIES.map((category) => ({ value: category.slug, label: category.name })),
  ];

  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((option) => {
        const isActive = query.category === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ category: option.value })}
            aria-pressed={isActive}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-[0.72rem] font-medium tracking-[0.1em] uppercase transition-all duration-300',
              isActive
                ? 'border-ink bg-ink text-ivory'
                : 'border-line text-ink-muted hover:border-clay hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortSelect({ query, onChange }: Pick<FiltersProps, 'query' | 'onChange'>) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="orden" className="shrink-0 text-[0.68rem] tracking-[0.12em] text-ink-muted uppercase">
        Ordenar por
      </label>
      <Select
        id="orden"
        value={query.sort}
        onChange={(event) => onChange({ sort: event.target.value as SortOption })}
        className="min-w-48 py-2 text-xs"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </Select>
    </div>
  );
}

/** Chips removibles con los filtros activos. */
export function ActiveFilterChips({ query, onChange, onReset }: Pick<FiltersProps, 'query' | 'onChange' | 'onReset'>) {
  const chips = describeActiveFilters(query);
  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => onChange(chip.clear)}
            className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs text-ink transition-colors hover:bg-sand"
          >
            {chip.label}
            <X className="size-3" aria-hidden="true" />
            <span className="sr-only">Quitar filtro</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onReset}
          className="link-underline relative text-xs text-ink-muted transition-colors hover:text-ink"
        >
          Limpiar todo
        </button>
      </li>
    </ul>
  );
}

/**
 * Panel de filtros. Se reutiliza tal cual en la columna lateral de desktop
 * y dentro del drawer móvil.
 */
export function ProductFilters({ query, onToggle, onReset, resultCount, idPrefix = 'f' }: FiltersProps) {
  const activeCount = countActiveFilters(query);

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-1">Precio</legend>
        {PRICE_BUCKETS.map((bucket) => (
          <Checkbox
            key={bucket.id}
            id={`${idPrefix}-price-${bucket.id}`}
            label={bucket.label}
            checked={query.priceBuckets.includes(bucket.id)}
            onChange={() => onToggle('priceBuckets', bucket.id)}
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-1">Disponibilidad</legend>
        {AVAILABILITY_FILTERS.map((filter) => (
          <Checkbox
            key={filter.id}
            id={`${idPrefix}-availability-${filter.id}`}
            label={filter.label}
            checked={query.availability.includes(filter.id)}
            onChange={() => onToggle('availability', filter.id)}
          />
        ))}
      </fieldset>

      {resultCount !== undefined && (
        <p className="text-xs text-ink-muted">
          {resultCount} {resultCount === 1 ? 'producto' : 'productos'}
        </p>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="link-underline relative self-start text-xs text-ink-muted transition-colors hover:text-ink"
        >
          Limpiar {activeCount} {activeCount === 1 ? 'filtro' : 'filtros'}
        </button>
      )}
    </div>
  );
}
