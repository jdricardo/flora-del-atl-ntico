import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Retardo en milisegundos para escalonar elementos de una misma fila. */
  delay?: number;
}

/**
 * Aparición suave al entrar en pantalla. Una sola vez por elemento y
 * desactivada si el sistema pide menos movimiento.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={cn('transition-none', isVisible ? 'animate-fade-up' : 'opacity-0', className)}
      style={isVisible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
