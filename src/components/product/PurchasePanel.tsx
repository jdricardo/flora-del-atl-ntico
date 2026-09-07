import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, PenLine, TriangleAlert } from 'lucide-react';
import { CITIES, getCity } from '@/data/cities';
import { GIFT_CARD_PRICE } from '@/data/site';
import { earliestDeliveryDate, formatLongDate, latestDeliveryDate } from '@/lib/dates';
import { formatCOP } from '@/lib/format';
import { MAX_DEDICATION_LENGTH } from '@/lib/validation';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { WishlistButton } from './WishlistButton';
import type { Product } from '@/types';

/** Opciones de entrega y personalización de la ficha de producto. */
export function PurchasePanel({ product }: { product: Product }) {
  const baseId = useId();
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const storedCityId = useCartStore((state) => state.cityId);
  const setCityId = useCartStore((state) => state.setCityId);

  const minDate = useMemo(() => earliestDeliveryDate(product.sameDayDelivery), [product.sameDayDelivery]);

  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(minDate);
  const [cityId, setLocalCityId] = useState(storedCityId ?? '');
  const [dedication, setDedication] = useState('');
  const [giftCard, setGiftCard] = useState(false);

  const city = getCity(cityId);
  const available = product.stock > 0;
  const maxUnits = Math.max(1, Math.min(20, product.stock));

  // La flor fresca no viaja a ciudades de solo preservado.
  const coverageWarning =
    city?.preservedOnly && product.category === 'flores-frescas'
      ? `A ${city.name} solo enviamos flores preservadas, regalos y objetos. Te sugerimos la colección Eterna.`
      : null;

  const options = {
    deliveryDate,
    cityId: cityId || null,
    dedication: dedication.trim(),
    giftCard,
  };

  const handleAdd = (openDrawer = false) => {
    if (cityId) setCityId(cityId);
    addToCart(product, { quantity, options, openDrawer });
  };

  const handleBuyNow = () => {
    if (cityId) setCityId(cityId);
    addToCart(product, { quantity, options });
    navigate('/checkout');
  };

  const unitTotal = product.price * quantity + (giftCard ? GIFT_CARD_PRICE * quantity : 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${baseId}-date`}
          label="Fecha de entrega"
          hint={deliveryDate ? formatLongDate(deliveryDate) : undefined}
        >
          <div className="relative">
            <CalendarDays
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <Input
              id={`${baseId}-date`}
              type="date"
              value={deliveryDate}
              min={minDate}
              max={latestDeliveryDate()}
              onChange={(event) => setDeliveryDate(event.target.value)}
              className="pl-10"
            />
          </div>
        </Field>

        <Field
          id={`${baseId}-city`}
          label="Ciudad de entrega"
          hint={city ? (city.sameDay ? 'Entrega el mismo día disponible' : 'Entrega en 2 a 5 días hábiles') : 'Define cobertura y costo'}
        >
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <Select
              id={`${baseId}-city`}
              value={cityId}
              onChange={(event) => setLocalCityId(event.target.value)}
              className="pl-10"
            >
              <option value="">Selecciona una ciudad</option>
              {CITIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </div>
        </Field>
      </div>

      {coverageWarning && (
        <p
          role="status"
          className="flex items-start gap-2.5 rounded-lg border border-gold-soft bg-gold/10 px-4 py-3 text-xs leading-relaxed text-ink"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
          {coverageWarning}
        </p>
      )}

      <Field
        id={`${baseId}-dedication`}
        label="Dedicatoria"
        hint={`${dedication.length}/${MAX_DEDICATION_LENGTH} caracteres · la transcribimos a mano, sin costo`}
      >
        <div className="relative">
          <PenLine className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-ink-muted" aria-hidden="true" />
          <Textarea
            id={`${baseId}-dedication`}
            rows={3}
            maxLength={MAX_DEDICATION_LENGTH}
            value={dedication}
            onChange={(event) => setDedication(event.target.value)}
            placeholder="Escribe tu mensaje…"
            className="pl-10"
          />
        </div>
      </Field>

      <Checkbox
        id={`${baseId}-giftcard`}
        checked={giftCard}
        onChange={(event) => setGiftCard(event.target.checked)}
        label={
          <span>
            Agregar tarjeta ilustrada de gran formato
            <span className="ml-1.5 text-ink-muted">+{formatCOP(GIFT_CARD_PRICE)}</span>
          </span>
        }
      />

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <div className="flex items-center justify-between gap-4">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={maxUnits}
            label={`Cantidad de ${product.name}`}
          />
          <p className="text-sm text-ink-muted">
            Total <span className="ml-1 font-medium text-ink tabular-nums">{formatCOP(unitTotal)}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button size="lg" fullWidth onClick={() => handleAdd(true)} disabled={!available}>
            {available ? 'Agregar al carrito' : 'Producto agotado'}
          </Button>
          <WishlistButton product={product} variant="inline" className="size-13 shrink-0" />
        </div>

        <Button variant="secondary" size="lg" fullWidth onClick={handleBuyNow} disabled={!available}>
          Comprar ahora
        </Button>
      </div>
    </div>
  );
}
