import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { cityName } from '@/data/cities';
import { SITE, whatsappLink } from '@/data/site';
import { Dialog } from '@/components/ui/Dialog';
import { useCartStore } from '@/store/useCartStore';
import { useIsPanelOpen, useUiStore } from '@/store/useUiStore';

const SECONDARY_LINKS = [
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Mis favoritos', to: '/favoritos' },
];

export function MobileMenu() {
  const isOpen = useIsPanelOpen('menu');
  const close = useUiStore((state) => state.close);
  const open = useUiStore((state) => state.open);
  const cityId = useCartStore((state) => state.cityId);
  const { pathname, search } = useLocation();

  // Cierra el menú al navegar.
  useEffect(() => {
    close();
  }, [pathname, search, close]);

  return (
    <Dialog open={isOpen} onClose={close} title="Menú" position="right" className="max-w-[22rem]">
      <nav aria-label="Menú de navegación" className="flex flex-col px-6 py-6">
        <Link
          to="/tienda"
          className="border-b border-line pb-4 font-serif text-2xl transition-colors hover:text-olive-600"
        >
          Toda la tienda
        </Link>

        <ul className="flex flex-col">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/tienda?categoria=${category.slug}`}
                className="flex items-baseline justify-between gap-3 border-b border-line py-4 transition-colors hover:text-olive-600"
              >
                <span className="truncate font-serif text-xl">{category.name}</span>
                <span className="shrink-0 text-[0.56rem] tracking-[0.1em] text-ink-muted uppercase">{category.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex flex-col pt-2">
          {SECONDARY_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="flex items-center gap-2 py-3 text-[0.78rem] font-medium tracking-[0.12em] uppercase transition-colors hover:text-olive-600"
              >
                {link.to === '/favoritos' && <Heart className="size-3.5" aria-hidden="true" />}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => open('city')}
          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-line bg-cream/60 px-4 py-3 text-left text-sm transition-colors hover:border-clay"
        >
          <span className="flex items-center gap-2 text-ink-muted">
            <MapPin className="size-4" aria-hidden="true" />
            Enviar a
          </span>
          <span className="font-medium">{cityId ? cityName(cityId) : 'Elegir ciudad'}</span>
        </button>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-lg bg-olive-500 px-4 py-3 text-sm font-medium text-ivory transition-colors hover:bg-olive-600"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Escríbenos por WhatsApp
        </a>

        <p className="mt-6 text-xs leading-relaxed text-ink-muted">
          {SITE.atelier.street} · {SITE.atelier.neighborhood}
          <br />
          {SITE.atelier.hours}
        </p>
      </nav>
    </Dialog>
  );
}
