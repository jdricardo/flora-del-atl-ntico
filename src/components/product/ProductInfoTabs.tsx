import { useState } from 'react';
import { PRODUCT_POLICIES } from '@/data/site';
import { cn } from '@/lib/cn';
import type { Product } from '@/types';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-olive-300" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Información del producto en pestañas accesibles (patrón tablist de ARIA). */
export function ProductInfoTabs({ product }: { product: Product }) {
  const tabs: Tab[] = [
    {
      id: 'descripcion',
      label: 'Descripción',
      content: <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">{product.description}</p>,
    },
    { id: 'caracteristicas', label: 'Características', content: <BulletList items={product.features} /> },
    { id: 'cuidados', label: 'Cuidados', content: <BulletList items={product.care} /> },
    { id: 'envios', label: 'Envíos', content: <BulletList items={PRODUCT_POLICIES.shipping} /> },
    { id: 'devoluciones', label: 'Cambios y devoluciones', content: <BulletList items={PRODUCT_POLICIES.returns} /> },
  ];

  const [active, setActive] = useState(tabs[0].id);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === active);
    if (event.key === 'ArrowRight') setActive(tabs[(currentIndex + 1) % tabs.length].id);
    if (event.key === 'ArrowLeft') setActive(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id);
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Información del producto"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative shrink-0 pb-4 text-[0.72rem] font-medium tracking-[0.12em] uppercase transition-colors',
              active === tab.id ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'absolute inset-x-0 -bottom-px h-px origin-left bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                active === tab.id ? 'scale-x-100' : 'scale-x-0',
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="animate-fade-in"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
