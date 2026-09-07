import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cityName } from '@/data/cities';
import { pluralize } from '@/lib/format';
import { selectItems, useCartStore, useCartTotals } from '@/store/useCartStore';
import { useIsPanelOpen, useUiStore } from '@/store/useUiStore';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CartLine } from './CartLine';
import { CartSummary } from './CartSummary';

export function CartDrawer() {
  const isOpen = useIsPanelOpen('cart');
  const close = useUiStore((state) => state.close);
  const openPanel = useUiStore((state) => state.open);
  const items = useCartStore(selectItems);
  const cityId = useCartStore((state) => state.cityId);
  const totals = useCartTotals();
  const navigate = useNavigate();

  const goToCheckout = () => {
    close();
    navigate('/checkout');
  };

  const isEmpty = items.length === 0;

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      title="Tu carrito"
      description={
        isEmpty
          ? undefined
          : `${totals.itemCount} ${pluralize(totals.itemCount, 'producto', 'productos')} en el carrito`
      }
      position="right"
      footer={
        isEmpty ? undefined : (
          <div className="flex flex-col gap-4">
            <CartSummary totals={totals} cityId={cityId} />
            <div className="flex flex-col gap-2">
              <Button size="lg" fullWidth onClick={goToCheckout}>
                Finalizar compra
              </Button>
              <Button variant="ghost" size="md" fullWidth onClick={close}>
                Seguir comprando
              </Button>
            </div>
          </div>
        )
      }
    >
      {isEmpty ? (
        <EmptyState
          icon="gift"
          title="Tu carrito está vacío"
          description="Explora la colección y guarda aquí lo que quieras enviar."
          action={
            <Button
              onClick={() => {
                close();
                navigate('/tienda');
              }}
            >
              Ver la colección
            </Button>
          }
        />
      ) : (
        <div className="px-6">
          <button
            type="button"
            onClick={() => openPanel('city')}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-cream/50 px-4 py-2.5 text-left text-xs transition-colors hover:border-clay"
          >
            <span className="flex items-center gap-2 text-ink-muted">
              <MapPin className="size-3.5" aria-hidden="true" />
              Ciudad de entrega
            </span>
            <span className="font-medium">{cityId ? cityName(cityId) : 'Elegir ciudad'}</span>
          </button>

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLine key={item.lineId} item={item} onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Dialog>
  );
}
