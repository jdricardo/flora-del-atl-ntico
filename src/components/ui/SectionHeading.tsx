import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Nivel semántico del encabezado. */
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', centered ? 'max-w-2xl items-center' : 'max-w-2xl')}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Tag className="text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</Tag>
        {description && <p className="text-[0.95rem] leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
