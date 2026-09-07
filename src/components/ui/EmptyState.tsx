import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'sprout', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 px-6 py-16 text-center', className)}>
      <span className="grid size-14 place-items-center rounded-full bg-cream text-olive-500">
        <Icon name={icon} className="size-6" />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="font-serif text-2xl">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
