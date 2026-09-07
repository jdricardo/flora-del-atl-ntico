import { Check, MapPin, Truck } from 'lucide-react';
import { CITIES } from '@/data/cities';
import { SHIPPING } from '@/data/site';
import { formatCOP } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useToast } from '@/context/ToastContext';
import { useCartStore } from '@/store/useCartStore';
import { useIsPanelOpen, useUiStore } from '@/store/useUiStore';
import { Dialog } from '@/components/ui/Dialog';

/**
 * Selección de ciudad de entrega. Determina el costo de envío que se
 * muestra en el carrito y precarga el checkout.
 */
export function CityModal() {
  const isOpen = useIsPanelOpen('city');
  const close = useUiStore((state) => state.close);
  const cityId = useCartStore((state) => state.cityId);
  const setCityId = useCartStore((state) => state.setCityId);
  const { notify } = useToast();

  const handleSelect = (id: string, name: string) => {
    setCityId(id);
    close();
    notify({ variant: 'success', title: `Enviando a ${name}`, description: 'Actualizamos el costo de envío.' });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      title="¿A dónde enviamos?"
      description="La ciudad define la cobertura, el costo y los tiempos de entrega."
      position="center"
      className="max-h-[85svh]"
    >
      <ul className="divide-y divide-line">
        {CITIES.map((city) => {
          const isSelected = city.id === cityId;
          return (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleSelect(city.id, city.name)}
                aria-pressed={isSelected}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-cream/70',
                  isSelected && 'bg-cream',
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <MapPin
                    className={cn('size-4 shrink-0', isSelected ? 'text-olive-600' : 'text-clay')}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{city.name}</span>
                    <span className="block truncate text-xs text-ink-muted">
                      {city.department}
                      {city.preservedOnly ? ' · Solo flor preservada y regalos' : ''}
                    </span>
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-right">
                    <span className="block text-xs font-medium">{formatCOP(city.shippingCost)}</span>
                    <span className="block text-[0.65rem] tracking-[0.08em] text-ink-muted uppercase">
                      {city.sameDay ? 'Hoy mismo' : '2 a 5 días'}
                    </span>
                  </span>
                  {isSelected && <Check className="size-4 text-olive-600" aria-hidden="true" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="flex items-start gap-2 border-t border-line bg-cream/40 px-6 py-4 text-xs leading-relaxed text-ink-muted">
        <Truck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        El envío es gratuito en compras iguales o superiores a {formatCOP(SHIPPING.freeThreshold)}, en cualquier ciudad.
      </p>
    </Dialog>
  );
}
