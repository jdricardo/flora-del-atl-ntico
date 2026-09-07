import type { ReactNode } from 'react';

interface CheckoutSectionProps {
  id: string;
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Bloque numerado del checkout. El `id` permite hacer scroll a errores. */
export function CheckoutSection({ id, step, title, description, children }: CheckoutSectionProps) {
  return (
    <section id={`seccion-${id}`} aria-labelledby={`titulo-${id}`} className="scroll-mt-32">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-serif text-xl text-clay tabular-nums">{String(step).padStart(2, '0')}</span>
        <div>
          <h2 id={`titulo-${id}`} className="font-serif text-2xl">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
