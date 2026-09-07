import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** `wide` para secciones a sangre completa, `narrow` para texto largo. */
  width?: 'default' | 'wide' | 'narrow';
}

const WIDTHS = {
  narrow: 'max-w-3xl',
  default: 'max-w-[86rem]',
  wide: 'max-w-[110rem]',
} as const;

export function Container({ children, className, as: Tag = 'div', width = 'default' }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', WIDTHS[width], className)}>{children}</Tag>;
}
