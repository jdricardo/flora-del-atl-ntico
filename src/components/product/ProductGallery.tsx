import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

/**
 * Galería con imagen principal y miniaturas. Navegable con las flechas del
 * teclado y con botones visibles en móvil.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  const total = images.length;
  const go = (next: number) => setIndex((next + total) % total);

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
      <div
        className="group relative flex-1 overflow-hidden rounded-2xl bg-cream"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(index + 1);
          if (event.key === 'ArrowLeft') go(index - 1);
        }}
        role="group"
        aria-roledescription="carrusel"
        aria-label={`Imágenes de ${productName}`}
        tabIndex={0}
      >
        <div className="grain relative aspect-4/5 overflow-hidden">
          {images.map((image, position) => (
            <img
              key={image}
              src={image}
              alt={`${productName} — imagen ${position + 1} de ${total}`}
              width={800}
              height={1000}
              loading={position === 0 ? 'eager' : 'lazy'}
              decoding="async"
              aria-hidden={position !== index}
              className={cn(
                'absolute inset-0 size-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                position === index ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Imagen anterior"
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-ink backdrop-blur-sm transition-all hover:bg-ivory lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Imagen siguiente"
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/85 text-ink backdrop-blur-sm transition-all hover:bg-ivory lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ivory/85 px-3 py-1 text-[0.65rem] tracking-[0.1em] tabular-nums backdrop-blur-sm">
              {index + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="flex gap-3 lg:w-20 lg:flex-col lg:gap-4">
          {images.map((image, position) => (
            <li key={image} className="flex-1 lg:flex-none">
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Ver imagen ${position + 1}`}
                aria-current={position === index}
                className={cn(
                  'w-full overflow-hidden rounded-lg border-2 transition-all duration-300',
                  position === index ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img
                  src={image}
                  alt=""
                  width={160}
                  height={200}
                  loading="lazy"
                  className="aspect-4/5 w-full bg-cream object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
