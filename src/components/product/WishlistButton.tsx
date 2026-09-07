import { Heart } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/cn';
import { useIsWishlisted, useWishlistStore } from '@/store/useWishlistStore';
import type { Product } from '@/types';

interface WishlistButtonProps {
  product: Product;
  /** `floating` se superpone a la imagen de la tarjeta; `inline` va junto a los botones. */
  variant?: 'floating' | 'inline';
  className?: string;
}

export function WishlistButton({ product, variant = 'floating', className }: WishlistButtonProps) {
  const isWishlisted = useIsWishlisted(product.id);
  const toggle = useWishlistStore((state) => state.toggle);
  const { notify } = useToast();

  const handleClick = () => {
    const added = toggle(product.id);
    notify({
      variant: 'info',
      title: added ? 'Guardado en favoritos' : 'Eliminado de favoritos',
      description: product.name,
      image: product.images[0],
      action: added ? { label: 'Ver favoritos', to: '/favoritos' } : undefined,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
      title={isWishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={cn(
        'grid place-items-center rounded-full transition-all duration-300',
        variant === 'floating'
          ? 'size-9 bg-ivory/85 text-ink backdrop-blur-sm hover:bg-ivory'
          : 'size-11 border border-line text-ink hover:border-ink',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-all duration-300',
          isWishlisted ? 'scale-110 fill-rose-500 text-rose-500' : 'fill-none',
        )}
        strokeWidth={1.6}
        aria-hidden="true"
      />
    </button>
  );
}
