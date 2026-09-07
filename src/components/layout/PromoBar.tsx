import { useEffect, useState } from 'react';
import { PROMO_MESSAGES } from '@/data/content';

const ROTATE_MS = 5200;

/**
 * Barra promocional superior. Rota los mensajes con un desvanecido corto
 * en lugar de un carrusel, para no competir con el resto de la página.
 */
export function PromoBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (PROMO_MESSAGES.length <= 1) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % PROMO_MESSAGES.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink text-ivory">
      <p
        key={index}
        className="animate-fade-in mx-auto max-w-[86rem] px-5 py-2.5 text-center text-[0.68rem] font-light tracking-[0.14em] uppercase sm:text-[0.7rem]"
        aria-live="polite"
      >
        {PROMO_MESSAGES[index]}
      </p>
    </div>
  );
}
