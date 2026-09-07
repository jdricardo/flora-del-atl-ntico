import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useEscapeKey, useFocusTrap, useLockBodyScroll } from '@/hooks/useDialogBehavior';

type Position = 'right' | 'bottom' | 'center';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Oculta el encabezado cuando el contenido ya aporta su propio título. */
  hideTitle?: boolean;
  position?: Position;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Descripción corta bajo el título. */
  description?: string;
}

const EXIT_MS = 240;

const PANEL_POSITION: Record<Position, string> = {
  right: 'ml-auto h-full w-full max-w-[27rem] sm:max-w-[29rem]',
  bottom: 'mt-auto w-full max-h-[88svh] rounded-t-3xl',
  center: 'm-auto w-full max-w-2xl rounded-2xl',
};

const PANEL_ENTER: Record<Position, string> = {
  right: 'animate-slide-in-right',
  bottom: 'animate-slide-up',
  center: 'animate-scale-in',
};

const PANEL_EXIT: Record<Position, string> = {
  right: 'animate-slide-out-right',
  bottom: 'animate-slide-out-down',
  center: 'animate-scale-out',
};

/**
 * Diálogo modal accesible reutilizado por el carrito, el buscador, los
 * filtros móviles y el selector de ciudad. Un solo lugar donde se resuelven
 * el foco, el Escape, el bloqueo de scroll y las animaciones de entrada
 * y salida.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle = false,
  position = 'right',
  children,
  footer,
  className,
  description,
}: DialogProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  useLockBodyScroll(mounted);
  useEscapeKey(open, onClose);
  useFocusTrap(panelRef, open);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn('fixed inset-0 z-100 flex', position === 'center' && 'items-center justify-center p-4 sm:p-6')}
      role="presentation"
    >
      <div
        className={cn('absolute inset-0 bg-ink/35 backdrop-blur-[2px]', closing ? 'animate-fade-out' : 'animate-fade-in')}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex flex-col overflow-hidden bg-ivory shadow-panel outline-none',
          PANEL_POSITION[position],
          closing ? PANEL_EXIT[position] : PANEL_ENTER[position],
          className,
        )}
      >
        <header
          className={cn(
            'flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5',
            hideTitle && 'sr-only border-0 p-0',
          )}
        >
          <div>
            <h2 id={titleId} className="font-serif text-2xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-ink-muted">
                {description}
              </p>
            )}
          </div>
          {!hideTitle && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer && <div className="shrink-0 border-t border-line bg-cream/60 px-6 py-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
