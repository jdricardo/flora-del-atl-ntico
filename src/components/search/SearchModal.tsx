import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CATEGORY_LABELS } from '@/data/categories';
import { searchProducts, SEARCH_SUGGESTIONS } from '@/lib/search';
import { getFeaturedProducts } from '@/lib/catalog';
import { formatCOP } from '@/lib/format';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useIsPanelOpen, useUiStore } from '@/store/useUiStore';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Product } from '@/types';

const MAX_RESULTS = 6;

function ResultRow({ product, onNavigate }: { product: Product; onNavigate: () => void }) {
  return (
    <li>
      <Link
        to={`/producto/${product.id}`}
        onClick={onNavigate}
        className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-cream/70"
      >
        <img
          src={product.images[0]}
          alt=""
          width={64}
          height={80}
          loading="lazy"
          className="size-16 shrink-0 rounded-lg bg-cream object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="block truncate font-serif text-lg leading-snug">{product.name}</span>
          <span className="block truncate text-xs text-ink-muted">{product.shortDescription}</span>
        </span>
        <span className="shrink-0 text-sm font-medium">{formatCOP(product.price)}</span>
      </Link>
    </li>
  );
}

/**
 * Búsqueda instantánea. El término se debounce 200 ms y los resultados se
 * calculan sobre el catálogo en memoria; al conectar el backend basta con
 * cambiar `searchProducts` por una llamada a la API.
 */
export function SearchModal() {
  const isOpen = useIsPanelOpen('search');
  const closePanel = useUiStore((state) => state.close);
  const open = useUiStore((state) => state.open);
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term, 200);

  // Atajo de teclado: Cmd/Ctrl + K abre el buscador.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open('search');
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /** Cerrar deja el buscador limpio para la próxima apertura. */
  const close = useCallback(() => {
    setTerm('');
    closePanel();
  }, [closePanel]);

  const trimmed = debouncedTerm.trim();
  const results = useMemo(() => (trimmed ? searchProducts(trimmed) : []), [trimmed]);
  const suggestions = useMemo(() => getFeaturedProducts(3), []);

  const submit = (value: string) => {
    const query = value.trim();
    if (!query) return;
    close();
    navigate(`/tienda?q=${encodeURIComponent(query)}`);
  };

  return (
    <Dialog open={isOpen} onClose={close} title="Buscar" hideTitle position="center" className="max-h-[80svh]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(term);
        }}
        role="search"
        className="flex items-center gap-3 border-b border-line px-6 py-4"
      >
        <Search className="size-5 shrink-0 text-ink-muted" aria-hidden="true" strokeWidth={1.6} />
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Busca “rosas”, “flores eternas”, “vela”…"
          aria-label="Buscar productos"
          autoComplete="off"
          className="w-full bg-transparent font-serif text-xl outline-none placeholder:font-sans placeholder:text-base placeholder:text-ink-muted/60"
        />
        <button
          type="button"
          onClick={close}
          className="shrink-0 text-[0.68rem] tracking-[0.12em] text-ink-muted uppercase transition-colors hover:text-ink"
        >
          Esc
        </button>
      </form>

      {!trimmed && (
        <div className="px-6 py-6">
          <p className="eyebrow mb-3">Búsquedas frecuentes</p>
          <ul className="flex flex-wrap gap-2">
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => setTerm(suggestion)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-8 mb-1">Los más pedidos</p>
          <ul className="-mx-6">
            {suggestions.map((product) => (
              <ResultRow key={product.id} product={product} onNavigate={close} />
            ))}
          </ul>
        </div>
      )}

      {trimmed && results.length === 0 && (
        <EmptyState
          icon="search"
          title={`Sin resultados para “${trimmed}”`}
          description="Revisa la ortografía o explora la colección completa; también puedes escribirnos y te ayudamos a encontrarlo."
        />
      )}

      {trimmed && results.length > 0 && (
        <div className="py-2">
          <p className="px-6 pt-2 pb-1 text-xs text-ink-muted">
            {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
          <ul>
            {results.slice(0, MAX_RESULTS).map((product) => (
              <ResultRow key={product.id} product={product} onNavigate={close} />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => submit(trimmed)}
            className="mt-1 flex w-full items-center justify-center gap-2 border-t border-line px-6 py-4 text-[0.7rem] font-medium tracking-[0.14em] uppercase transition-colors hover:bg-cream/70"
          >
            Ver los {results.length} resultados
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </Dialog>
  );
}
