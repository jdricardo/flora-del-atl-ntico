import { Lock } from 'lucide-react';
import { PAYMENT_METHODS } from '@/data/site';
import { PSE_BANKS, formatCardNumber, formatExpiry, formatPhone, onlyDigits } from '@/lib/validation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { Field, Input, Select } from '@/components/ui/Field';
import type { CheckoutFormValues } from '@/lib/validation';
import type { PaymentMethodId } from '@/types';

interface PaymentMethodsProps {
  values: CheckoutFormValues;
  showError: (field: keyof CheckoutFormValues) => string | undefined;
  onChange: <K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => void;
  onBlur: (field: keyof CheckoutFormValues) => void;
}

/**
 * Interfaz de pago simulada. Cada método deja lista la forma de los datos
 * que pediría la pasarela real (Wompi, Mercado Pago, PayU o similar);
 * ningún dato se envía a ningún servicio.
 */
export function PaymentMethods({ values, showError, onChange, onBlur }: PaymentMethodsProps) {
  const select = (id: PaymentMethodId) => onChange('paymentMethod', id);

  return (
    <div className="flex flex-col gap-5">
      <ul className="grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = values.paymentMethod === method.id;
          return (
            <li key={method.id}>
              <label
                className={cn(
                  'flex h-full cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-300',
                  isSelected ? 'border-ink bg-cream/70' : 'border-line hover:border-clay',
                )}
              >
                <input
                  type="radio"
                  name="metodo-pago"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => select(method.id)}
                  className="sr-only"
                />
                <Icon
                  name={method.icon}
                  className={cn('mt-0.5 size-5 shrink-0', isSelected ? 'text-ink' : 'text-ink-muted')}
                  strokeWidth={1.6}
                />
                <span>
                  <span className="block text-sm font-medium">{method.name}</span>
                  <span className="block text-xs text-ink-muted">{method.description}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {values.paymentMethod === 'tarjeta' && (
        <div className="animate-fade-in grid gap-4 rounded-xl border border-line bg-cream/40 p-5 sm:grid-cols-2">
          <Field
            id="cardNumber"
            label="Número de tarjeta"
            required
            error={showError('cardNumber')}
            className="sm:col-span-2"
          >
            <Input
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={values.cardNumber}
              invalid={Boolean(showError('cardNumber'))}
              onChange={(event) => onChange('cardNumber', formatCardNumber(event.target.value))}
              onBlur={() => onBlur('cardNumber')}
            />
          </Field>

          <Field id="cardName" label="Nombre en la tarjeta" required error={showError('cardName')} className="sm:col-span-2">
            <Input
              id="cardName"
              autoComplete="cc-name"
              placeholder="Como aparece en la tarjeta"
              value={values.cardName}
              invalid={Boolean(showError('cardName'))}
              onChange={(event) => onChange('cardName', event.target.value)}
              onBlur={() => onBlur('cardName')}
            />
          </Field>

          <Field id="cardExpiry" label="Vencimiento" required error={showError('cardExpiry')}>
            <Input
              id="cardExpiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={values.cardExpiry}
              invalid={Boolean(showError('cardExpiry'))}
              onChange={(event) => onChange('cardExpiry', formatExpiry(event.target.value))}
              onBlur={() => onBlur('cardExpiry')}
            />
          </Field>

          <Field id="cardCvc" label="CVC" required error={showError('cardCvc')}>
            <Input
              id="cardCvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              maxLength={4}
              value={values.cardCvc}
              invalid={Boolean(showError('cardCvc'))}
              onChange={(event) => onChange('cardCvc', onlyDigits(event.target.value).slice(0, 4))}
              onBlur={() => onBlur('cardCvc')}
            />
          </Field>

          <p className="flex items-center gap-2 text-xs text-ink-muted sm:col-span-2">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            Interfaz de demostración: no hay pasarela conectada y ningún dato se transmite.
          </p>
        </div>
      )}

      {values.paymentMethod === 'pse' && (
        <div className="animate-fade-in rounded-xl border border-line bg-cream/40 p-5">
          <Field id="pseBank" label="Banco" required error={showError('pseBank')}>
            <Select
              id="pseBank"
              value={values.pseBank}
              invalid={Boolean(showError('pseBank'))}
              onChange={(event) => onChange('pseBank', event.target.value)}
              onBlur={() => onBlur('pseBank')}
            >
              <option value="">Selecciona tu banco</option>
              {PSE_BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </Select>
          </Field>
          <p className="mt-3 text-xs text-ink-muted">
            Al confirmar serías redirigido al portal de tu banco para autorizar el débito.
          </p>
        </div>
      )}

      {values.paymentMethod === 'nequi' && (
        <div className="animate-fade-in rounded-xl border border-line bg-cream/40 p-5">
          <Field id="nequiPhone" label="Celular Nequi" required error={showError('nequiPhone')}>
            <Input
              id="nequiPhone"
              inputMode="tel"
              placeholder="300 000 0000"
              value={values.nequiPhone}
              invalid={Boolean(showError('nequiPhone'))}
              onChange={(event) => onChange('nequiPhone', formatPhone(event.target.value))}
              onBlur={() => onBlur('nequiPhone')}
            />
          </Field>
          <p className="mt-3 text-xs text-ink-muted">
            Recibirías una notificación push en la app para aprobar el pago en menos de un minuto.
          </p>
        </div>
      )}

      {values.paymentMethod === 'transferencia' && (
        <div className="animate-fade-in rounded-xl border border-line bg-cream/40 p-5 text-sm">
          <p className="mb-3 font-medium">Datos para la transferencia</p>
          <dl className="grid gap-1.5 text-xs text-ink-muted sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="min-w-24">Banco</dt>
              <dd className="font-medium text-ink">Bancolombia</dd>
            </div>
            <div className="flex gap-2">
              <dt className="min-w-24">Tipo</dt>
              <dd className="font-medium text-ink">Cuenta de ahorros</dd>
            </div>
            <div className="flex gap-2">
              <dt className="min-w-24">Número</dt>
              <dd className="font-medium text-ink">000 000000 00</dd>
            </div>
            <div className="flex gap-2">
              <dt className="min-w-24">Titular</dt>
              <dd className="font-medium text-ink">Flora del Atlántico S.A.S.</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-ink-muted">
            Datos de demostración. Tras confirmar el pedido te enviaríamos las instrucciones al correo y podrías
            adjuntar el comprobante por WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
}
