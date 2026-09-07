import { Link } from 'react-router-dom';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { buttonStyles, type ButtonStyleOptions } from './buttonStyles';
import { cn } from '@/lib/cn';

type SharedProps = ButtonStyleOptions & { children?: ReactNode };

interface ButtonProps extends SharedProps, Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> {
  loading?: boolean;
}

export function Button({ variant, size, fullWidth, className, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends SharedProps, Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children' | 'href'> {
  /** Ruta interna (react-router). */
  to?: string;
  /** URL externa. Se abre en una pestaña nueva. */
  href?: string;
}

/** Mismo aspecto que Button, pero semánticamente un enlace. */
export function ButtonLink({ variant, size, fullWidth, className, children, to, href, ...props }: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, fullWidth, className });

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
      {children}
    </a>
  );
}

interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  /** Obligatorio: los botones de solo icono necesitan nombre accesible. */
  label: string;
  className?: string;
  badge?: number;
}

export function IconButton({ label, className, badge, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:bg-cream',
        className,
      )}
      {...props}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid min-w-[1.125rem] place-items-center rounded-full bg-ink px-1 text-[0.62rem] leading-[1.125rem] font-medium text-ivory">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
