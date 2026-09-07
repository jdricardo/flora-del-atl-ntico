import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Envoltura de campo: etiqueta visible, ayuda y error asociados por aria. */
export function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[0.78rem] font-medium tracking-wide text-ink">
        {label}
        {required && (
          <span className="ml-1 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

const CONTROL =
  'w-full rounded-lg border bg-white/70 px-4 py-2.5 text-sm text-ink transition-colors duration-200 placeholder:text-ink-muted/60 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60';

export const controlStyles = (invalid?: boolean, className?: string) =>
  cn(CONTROL, invalid ? 'border-rose-400' : 'border-line hover:border-clay', className);

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'className'> {
  invalid?: boolean;
  className?: string;
}

export function Input({ invalid, className, id, ...props }: InputProps) {
  return (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={controlStyles(invalid, className)}
      {...props}
    />
  );
}

interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'className'> {
  invalid?: boolean;
  className?: string;
}

export function Textarea({ invalid, className, id, ...props }: TextareaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={controlStyles(invalid, cn('resize-y leading-relaxed', className))}
      {...props}
    />
  );
}

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'className'> {
  invalid?: boolean;
  className?: string;
}

export function Select({ invalid, className, id, children, ...props }: SelectProps) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={controlStyles(invalid, cn('appearance-none bg-[right_0.9rem_center] bg-no-repeat pr-10', className))}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%236b6459' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type'> {
  label: ReactNode;
  error?: string;
  className?: string;
}

export function Checkbox({ label, error, className, id, ...props }: CheckboxProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <span className="relative mt-0.5 grid shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            className="peer size-4 cursor-pointer appearance-none rounded-[3px] border border-clay bg-white transition-colors checked:border-ink checked:bg-ink"
            aria-invalid={error ? true : undefined}
            {...props}
          />
          <Check
            className="pointer-events-none absolute size-3 text-ivory opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="leading-snug">{label}</span>
      </label>
      {error && (
        <p role="alert" className="pl-7 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
