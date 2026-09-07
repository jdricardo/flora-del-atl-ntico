import { Outlet } from 'react-router-dom';
import { PromoBar } from '@/components/layout/PromoBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { CityModal } from '@/components/common/CityModal';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { ToastViewport } from '@/components/ui/ToastViewport';

/**
 * Estructura común: barra promocional, header, contenido, footer y los
 * paneles globales (carrito, buscador, menú móvil, ciudad, toasts).
 */
export function RootLayout() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-xs focus:tracking-[0.14em] focus:text-ivory focus:uppercase"
      >
        Saltar al contenido
      </a>

      <ScrollToTop />
      <PromoBar />
      <Header />

      <main id="contenido" tabIndex={-1} className="min-h-[60svh] outline-none">
        <Outlet />
      </main>

      <Footer />

      <CartDrawer />
      <SearchModal />
      <MobileMenu />
      <CityModal />
      <WhatsAppButton />
      <ToastViewport />
    </>
  );
}
