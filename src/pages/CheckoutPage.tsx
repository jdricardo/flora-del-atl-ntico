import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { CITIES, getCity } from '@/data/cities';
import { DELIVERY_SLOTS } from '@/data/site';
import { earliestDeliveryDate, formatLongDate, latestDeliveryDate } from '@/lib/dates';
import { createOrderId } from '@/lib/id';
import {
  MAX_DEDICATION_LENGTH,
  createEmptyCheckoutValues,
  firstStepWithError,
  formatPhone,
  validateCheckout,
  type CheckoutFormValues,
} from '@/lib/validation';
import { cn } from '@/lib/cn';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/context/ToastContext';
import { selectItems, useCartStore, useCartTotals } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field';
import { CheckoutSection } from '@/components/checkout/CheckoutSection';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import type { Order } from '@/types';

export function CheckoutPage() {
  const items = useCartStore(selectItems);
  const storedCityId = useCartStore((state) => state.cityId);
  const setCityId = useCartStore((state) => state.setCityId);
  const clearCart = useCartStore((state) => state.clear);
  const totals = useCartTotals();
  const setLastOrder = useOrderStore((state) => state.setLastOrder);
  const { notify } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState<CheckoutFormValues>(() =>
    createEmptyCheckoutValues({
      cityId: storedCityId ?? '',
      deliveryDate: items[0]?.options.deliveryDate ?? earliestDeliveryDate(true),
      dedication: items[0]?.options.dedication ?? '',
    }),
  );
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * Al confirmar se vacía el carrito, y el store de Zustand re-renderiza de
   * forma sincrónica. Sin esta marca, el guard de "carrito vacío" de más abajo
   * se dispararía antes de que la navegación a la confirmación se complete y
   * el usuario terminaría de vuelta en la tienda.
   */
  const hasPlacedOrder = useRef(false);

  useSeo({ title: 'Finalizar compra', path: '/checkout', noindex: true });

  // Sin productos no hay nada que pagar; tras confirmar, la marca evita que el
  // vaciado del carrito nos devuelva a la tienda en lugar de la confirmación.
  useEffect(() => {
    if (items.length === 0 && !hasPlacedOrder.current) navigate('/tienda', { replace: true });
  }, [items.length, navigate]);

  const errors = useMemo(() => validateCheckout(values), [values]);

  const change = <K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === 'cityId' && typeof value === 'string' && value) setCityId(value);
  };

  const blur = (field: keyof CheckoutFormValues) => setTouched((current) => ({ ...current, [field]: true }));

  /** Un error solo se muestra si el campo fue tocado o ya se intentó enviar. */
  const showError = (field: keyof CheckoutFormValues) =>
    submitAttempted || touched[field] ? errors[field] : undefined;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const step = firstStepWithError(errors);
    if (step) {
      notify({ variant: 'error', title: 'Revisa los datos marcados', description: 'Faltan campos por completar.' });
      document.getElementById(`seccion-${step}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setIsSubmitting(true);

    // Punto de integración: POST /api/orders + creación de la intención de pago.
    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      status: 'confirmado',
      items,
      customer: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone,
      },
      address: {
        cityId: values.cityId,
        line1: values.line1.trim(),
        complement: values.complement.trim(),
        neighborhood: values.neighborhood.trim(),
      },
      delivery: {
        date: values.deliveryDate,
        slotId: values.slotId,
        dedication: values.dedication.trim(),
      },
      paymentMethod: values.paymentMethod,
      totals,
    };

    // Latencia simulada para que el estado de carga sea visible.
    setTimeout(() => {
      hasPlacedOrder.current = true;
      setLastOrder(order);
      navigate('/pedido-confirmado', { replace: true });
      clearCart();
      setIsSubmitting(false);
    }, 900);
  };

  if (items.length === 0) return null;

  const selectedCity = getCity(values.cityId);

  return (
    <Container className="pt-8 pb-24 lg:pt-10">
      <Breadcrumbs
        items={[{ label: 'Inicio', to: '/' }, { label: 'Tienda', to: '/tienda' }, { label: 'Finalizar compra' }]}
        className="mb-8"
      />

      <div className="flex flex-col gap-4">
        <span className="eyebrow">Paso final</span>
        <h1 className="text-4xl sm:text-5xl">Finalizar compra</h1>
        <Link to="/tienda" className="inline-flex items-center gap-2 text-xs text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Seguir comprando
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-14">
          <CheckoutSection id="cliente" step={1} title="Información del cliente">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firstName" label="Nombre" required error={showError('firstName')}>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  value={values.firstName}
                  invalid={Boolean(showError('firstName'))}
                  onChange={(event) => change('firstName', event.target.value)}
                  onBlur={() => blur('firstName')}
                />
              </Field>

              <Field id="lastName" label="Apellido" required error={showError('lastName')}>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  value={values.lastName}
                  invalid={Boolean(showError('lastName'))}
                  onChange={(event) => change('lastName', event.target.value)}
                  onBlur={() => blur('lastName')}
                />
              </Field>

              <Field id="email" label="Correo electrónico" required error={showError('email')} hint="Ahí enviamos la confirmación.">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={values.email}
                  invalid={Boolean(showError('email'))}
                  onChange={(event) => change('email', event.target.value)}
                  onBlur={() => blur('email')}
                />
              </Field>

              <Field id="phone" label="Celular" required error={showError('phone')} hint="Para coordinar la entrega.">
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="300 000 0000"
                  value={values.phone}
                  invalid={Boolean(showError('phone'))}
                  onChange={(event) => change('phone', formatPhone(event.target.value))}
                  onBlur={() => blur('phone')}
                />
              </Field>
            </div>
          </CheckoutSection>

          <CheckoutSection id="direccion" step={2} title="Dirección de entrega">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="cityId"
                label="Ciudad"
                required
                error={showError('cityId')}
                hint={
                  selectedCity
                    ? selectedCity.sameDay
                      ? 'Cobertura de entrega el mismo día'
                      : 'Entrega en 2 a 5 días hábiles'
                    : undefined
                }
              >
                <Select
                  id="cityId"
                  value={values.cityId}
                  invalid={Boolean(showError('cityId'))}
                  onChange={(event) => change('cityId', event.target.value)}
                  onBlur={() => blur('cityId')}
                >
                  <option value="">Selecciona una ciudad</option>
                  {CITIES.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} — {city.department}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field id="neighborhood" label="Barrio" required error={showError('neighborhood')}>
                <Input
                  id="neighborhood"
                  value={values.neighborhood}
                  invalid={Boolean(showError('neighborhood'))}
                  onChange={(event) => change('neighborhood', event.target.value)}
                  onBlur={() => blur('neighborhood')}
                />
              </Field>

              <Field id="line1" label="Dirección" required error={showError('line1')} className="sm:col-span-2">
                <Input
                  id="line1"
                  autoComplete="street-address"
                  placeholder="Carrera 11 #85-32"
                  value={values.line1}
                  invalid={Boolean(showError('line1'))}
                  onChange={(event) => change('line1', event.target.value)}
                  onBlur={() => blur('line1')}
                />
              </Field>

              <Field
                id="complement"
                label="Complemento"
                error={showError('complement')}
                hint="Apartamento, torre, oficina, indicaciones para el portero."
                className="sm:col-span-2"
              >
                <Input
                  id="complement"
                  placeholder="Apto 502 · Torre B"
                  value={values.complement}
                  onChange={(event) => change('complement', event.target.value)}
                />
              </Field>
            </div>
          </CheckoutSection>

          <CheckoutSection id="entrega" step={3} title="Entrega" description="Elige el día y la franja horaria.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="deliveryDate"
                label="Fecha de entrega"
                required
                error={showError('deliveryDate')}
                hint={values.deliveryDate ? formatLongDate(values.deliveryDate) : undefined}
              >
                <Input
                  id="deliveryDate"
                  type="date"
                  min={earliestDeliveryDate(true)}
                  max={latestDeliveryDate()}
                  value={values.deliveryDate}
                  invalid={Boolean(showError('deliveryDate'))}
                  onChange={(event) => change('deliveryDate', event.target.value)}
                  onBlur={() => blur('deliveryDate')}
                />
              </Field>

              <fieldset className="flex flex-col gap-1.5">
                <legend className="mb-1.5 text-[0.78rem] font-medium tracking-wide">
                  Franja horaria
                  <span className="ml-1 text-rose-500" aria-hidden="true">
                    *
                  </span>
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {DELIVERY_SLOTS.map((slot) => (
                    <label
                      key={slot.id}
                      className={cn(
                        'flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-center transition-all duration-300',
                        values.slotId === slot.id ? 'border-ink bg-cream/70' : 'border-line hover:border-clay',
                      )}
                    >
                      <input
                        type="radio"
                        name="franja"
                        value={slot.id}
                        checked={values.slotId === slot.id}
                        onChange={() => change('slotId', slot.id)}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{slot.label}</span>
                      <span className="text-[0.62rem] leading-tight text-ink-muted">{slot.range}</span>
                    </label>
                  ))}
                </div>
                {showError('slotId') && (
                  <p role="alert" className="text-xs font-medium text-rose-600">
                    {showError('slotId')}
                  </p>
                )}
              </fieldset>
            </div>
          </CheckoutSection>

          <CheckoutSection
            id="dedicatoria"
            step={4}
            title="Dedicatoria"
            description="La transcribimos a mano en una tarjeta de algodón, sin costo."
          >
            <Field
              id="dedication"
              label="Mensaje"
              error={showError('dedication')}
              hint={`${values.dedication.length}/${MAX_DEDICATION_LENGTH} caracteres`}
            >
              <Textarea
                id="dedication"
                rows={4}
                maxLength={MAX_DEDICATION_LENGTH}
                placeholder="Escribe tu mensaje..."
                value={values.dedication}
                invalid={Boolean(showError('dedication'))}
                onChange={(event) => change('dedication', event.target.value)}
                onBlur={() => blur('dedication')}
              />
            </Field>
          </CheckoutSection>

          <CheckoutSection id="pago" step={5} title="Pago">
            <PaymentMethods values={values} showError={showError} onChange={change} onBlur={blur} />

            <div className="mt-6 flex flex-col gap-4">
              <Checkbox
                id="acceptTerms"
                checked={values.acceptTerms}
                onChange={(event) => change('acceptTerms', event.target.checked)}
                error={showError('acceptTerms')}
                label={
                  <span className="text-xs leading-relaxed text-ink-muted">
                    Acepto los términos y condiciones y la política de tratamiento de datos personales de Flora
                    Magdalena.
                  </span>
                }
              />

              <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
                {isSubmitting ? 'Confirmando pedido…' : 'Confirmar pedido'}
              </Button>

              <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
                <Lock className="size-3.5" aria-hidden="true" />
                Tienda de demostración: no se procesa ningún pago real.
              </p>
            </div>
          </CheckoutSection>
        </div>

        <aside aria-label="Resumen del pedido" className="lg:sticky lg:top-32 lg:self-start">
          <CheckoutSummary items={items} totals={totals} cityId={values.cityId || storedCityId} />
        </aside>
      </form>
    </Container>
  );
}
