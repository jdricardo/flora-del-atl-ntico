import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Id abierto por defecto. */
  defaultOpen?: string;
  /** `true` permite varios paneles abiertos a la vez. */
  multiple?: boolean;
  className?: string;
}

/**
 * Acordeón accesible: botón con `aria-expanded`, región asociada y
 * navegación por teclado nativa. La apertura se anima con grid-rows,
 * que no requiere medir alturas.
 */
export function Accordion({ items, defaultOpen, multiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen ? [defaultOpen] : []);
  const baseId = useId();

  const toggle = (id: string) => {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return multiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-olive-600"
              >
                <span className="font-serif text-lg sm:text-xl">{item.question}</span>
                <Plus
                  className={cn(
                    'size-4 shrink-0 text-ink-muted transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-olive-600',
                    isOpen && 'rotate-45',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className={cn('max-w-3xl pr-8 pb-6 text-sm leading-relaxed text-ink-muted', !isOpen && 'invisible')}>
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
