import { Link } from 'react-router-dom';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/cn';
import type { ToastVariant } from '@/types';

const ICONS: Record<ToastVariant, typeof CircleCheck> = {
  success: CircleCheck,
  info: Info,
  error: TriangleAlert,
};

const ACCENTS: Record<ToastVariant, string> = {
  success: 'text-olive-500',
  info: 'text-ink-muted',
  error: 'text-rose-600',
};

/**
 * Pila de notificaciones. Vive una sola vez en el layout y escucha el
 * ToastContext, de modo que cualquier componente pueda avisar sin
 * pasar props.
 */
export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-200 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-90"
      role="region"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => {
        const ToastIcon = ICONS[toast.variant];
        return (
          <output
            key={toast.id}
            className="animate-slide-down pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-ivory/95 p-3.5 shadow-lift backdrop-blur-sm"
          >
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                className="size-12 shrink-0 rounded-lg object-cover"
                width={48}
                height={48}
              />
            ) : (
              <ToastIcon className={cn('mt-0.5 size-5 shrink-0', ACCENTS[toast.variant])} aria-hidden="true" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              {toast.description && <p className="mt-0.5 truncate text-xs text-ink-muted">{toast.description}</p>}
              {toast.action?.to && (
                <Link
                  to={toast.action.to}
                  onClick={() => dismiss(toast.id)}
                  className="link-underline mt-2 inline-block text-[0.7rem] font-medium tracking-[0.12em] text-ink uppercase"
                >
                  {toast.action.label}
                </Link>
              )}
              {toast.action && !toast.action.to && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick?.();
                    dismiss(toast.id);
                  }}
                  className="link-underline mt-2 inline-block text-[0.7rem] font-medium tracking-[0.12em] text-ink uppercase"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </output>
        );
      })}
    </div>
  );
}
