import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none disabled:pointer-events-none disabled:opacity-45';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-ivory hover:bg-olive-700 active:scale-[0.985] shadow-soft hover:shadow-lift',
  secondary: 'border border-ink/25 text-ink bg-transparent hover:border-ink hover:bg-ink hover:text-ivory active:scale-[0.985]',
  soft: 'bg-cream text-ink border border-transparent hover:bg-sand active:scale-[0.985]',
  ghost: 'text-ink hover:bg-cream active:scale-[0.985]',
  link: 'text-ink underline-offset-4 hover:underline px-0',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.72rem] uppercase tracking-[0.14em] rounded-full',
  md: 'h-11 px-6 text-[0.78rem] uppercase tracking-[0.14em] rounded-full',
  lg: 'h-13 px-8 text-[0.82rem] uppercase tracking-[0.16em] rounded-full',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonStyles({ variant = 'primary', size = 'md', fullWidth, className }: ButtonStyleOptions = {}): string {
  return cn(BASE, VARIANTS[variant], variant !== 'link' && SIZES[size], fullWidth && 'w-full', className);
}
