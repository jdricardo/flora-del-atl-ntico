import { useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { getAllProducts } from '@/lib/catalog';
import { applyCatalogQuery, countActiveFilters } from '@/lib/filters';
import { getCategory } from '@/data/categories';
import { useCatalogQuery } from '@/hooks/useCatalogQuery';
import { useDeferredCatalog } from '@/hooks/useDeferredCatalog';
import { useSeo } from '@/hooks/useSeo';
import { useIsPanelOpen, useUiStore } from '@/store/useUiStore';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  ActiveFilterChips,
  CategoryTabs,
  ProductFilters,
  SortSelect,
} from '@/components/product/ProductFilters';

export function ShopPage() {
  const { query, update, toggleInList, reset } = useCatalogQuery();
  const products = getAllProducts();

  const results = useMemo(() => applyCatalogQuery(products, query), [products, query]);
  const { isLoading } = useDeferredCatalog(results, 500);

  const isFiltersOpen = useIsPanelOpen('filters');
  const openPanel = useUiStore((state) => state.open);
  const closePanel = useUiStore((state) => state.close);

  const category = query.category !== 'todos' ? getCategory(query.category) : undefined;
  const activeCount = countActiveFilters(query);

  useSeo({
    title: category ? `${category.name} · Tienda` : 'Toda la colección · Tienda',
    description: category?.description ?? 'Flores, regalos y detalles diseñados para cada ocasión. Envíos en toda Colombia.',
    path: category ? `/tienda?categoria=${category.slug}` : '/tienda',
  });

  const filterProps = {
    query,
    onChange: update,
    onToggle: toggleInList,
    onReset: reset,
  };

  return (
    <>
      <Container className="pt-8 pb-10 lg:pt-10">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Tienda', to: '/tienda' },
            ...(category ? [{ label: category.name }] : []),
          ]}
          className="mb-8"
        />

        <div className="flex max-w-2xl flex-col gap-4">
          <span className="eyebrow">{category ? category.tagline : 'Catálogo completo'}</span>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem]">
            {category ? category.name : 'Toda la colección'}
          </h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
            {category
              ? category.description
              : 'Flores, regalos y detalles diseñados para cada ocasión.'}
          </p>
        </div>
      </Container>

      <Container className="pb-24">
        <div className="border-y border-line py-4">
          <CategoryTabs query={query} onChange={update} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openPanel('filters')}
              className="lg:hidden"
              aria-expanded={isFiltersOpen}
            >
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>
            <p className="text-xs text-ink-muted">
              {isLoading ? 'Cargando…' : `${results.length} ${results.length === 1 ? 'producto' : 'productos'}`}
            </p>
          </div>

          <SortSelect query={query} onChange={update} />
        </div>

        <ActiveFilterChips query={query} onChange={update} onReset={reset} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <aside aria-label="Filtros" className="hidden lg:block">
            <div className="sticky top-32">
              <ProductFilters {...filterProps} idPrefix="desktop" />
            </div>
          </aside>

          <div>
            <ProductGrid
              products={results}
              isLoading={isLoading}
              columns={3}
              skeletonCount={9}
              emptyState={
                <EmptyState
                  icon="search"
                  title="No encontramos productos con esos filtros"
                  description="Prueba ampliando el rango de precio o quitando algún filtro."
                  action={
                    <Button variant="secondary" onClick={reset}>
                      Limpiar filtros
                    </Button>
                  }
                />
              }
            />
          </div>
        </div>
      </Container>

      {/* Filtros en móvil: drawer inferior. */}
      <Dialog
        open={isFiltersOpen}
        onClose={closePanel}
        title="Filtros"
        position="bottom"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={reset}>
              Limpiar
            </Button>
            <Button fullWidth onClick={closePanel} className="whitespace-nowrap">
              Aplicar ({results.length})
            </Button>
          </div>
        }
      >
        <div className="px-6 py-6">
          <p className="eyebrow mb-3">Categoría</p>
          <div className="mb-8">
            <CategoryTabs query={query} onChange={update} />
          </div>
          <ProductFilters {...filterProps} resultCount={results.length} idPrefix="mobile" />
        </div>
      </Dialog>
    </>
  );
}
