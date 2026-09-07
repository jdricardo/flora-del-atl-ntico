import { Link } from 'react-router-dom';
import { SITE } from '@/data/site';
import { cn } from '@/lib/cn';

/** Marca gráfica propia: tallo con dos hojas y un botón floral. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M16 27V13.5" />
        <path d="M16 19.5c-4.2 0-6.6-2.4-6.6-5.4 3.6 0 6.6 1.8 6.6 5.4Z" />
        <path d="M16 19.5c4.2 0 6.6-2.4 6.6-5.4-3.6 0-6.6 1.8-6.6 5.4Z" />
      </g>
      <circle cx="16" cy="8.6" r="3.1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** `compact` muestra solo el apellido, para el header móvil. */
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label={`${SITE.name} — inicio`}
      className={cn('group inline-flex items-center gap-2.5 text-ink', className)}
    >
      <Mark className="size-6 shrink-0 text-olive-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.15rem] tracking-[0.02em] whitespace-nowrap sm:text-[1.5rem]">
          {compact ? 'Flora' : SITE.name}
        </span>
        <span className="mt-0.5 hidden text-[0.55rem] tracking-[0.28em] text-ink-muted uppercase sm:block">
          {SITE.tagline}
        </span>
      </span>
    </Link>
  );
}
