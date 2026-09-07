import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { ProductBadge } from '@/types';

type Tone = 'ink' | 'olive' | 'rose' | 'gold' | 'muted';

const TONES: Record<Tone, string> = {
  ink: 'bg-ink text-ivory',
  olive: 'bg-olive-500 text-ivory',
  rose: 'bg-rose-300 text-ink',
  gold: 'bg-gold text-ivory',
  muted: 'bg-cream text-ink-muted',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = 'ink', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.12em] uppercase',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const PRODUCT_BADGE_META: Record<ProductBadge, { label: string; tone: Tone }> = {
  nuevo: { label: 'Nuevo', tone: 'olive' },
  bestseller: { label: 'Más vendido', tone: 'ink' },
  'edicion-limitada': { label: 'Edición limitada', tone: 'gold' },
  premium: { label: 'Premium', tone: 'rose' },
};

export function ProductBadges({ badges, className }: { badges: ProductBadge[]; className?: string }) {
  if (badges.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {badges.map((badge) => (
        <Badge key={badge} tone={PRODUCT_BADGE_META[badge].tone}>
          {PRODUCT_BADGE_META[badge].label}
        </Badge>
      ))}
    </div>
  );
}
