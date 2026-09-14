import { MessageCircle } from 'lucide-react';
import { PAYMENT_METHODS } from '@/data/site';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import type { CheckoutFormValues } from '@/lib/validation';
import type { PaymentMethodId } from '@/types';

interface PaymentMethodsProps {
  values: CheckoutFormValues;
  onChange: <K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) => void;
}

/**
 * La floristería recibe transferencia y efectivo, y el pedido se cierra por
 * WhatsApp: aquí solo se elige la preferencia, que viaja en el mensaje. Los
 * datos de la cuenta se acuerdan en el chat, no se publican en el sitio.
 */
export function PaymentMethods({ values, onChange }: PaymentMethodsProps) {
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

      <p className="flex items-start gap-2.5 rounded-xl border border-line bg-cream/40 px-4 py-3 text-xs leading-relaxed text-ink-muted">
        <MessageCircle className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden="true" />
        Al confirmar se abre WhatsApp con tu pedido listo para enviar. Allí te confirmamos disponibilidad, te pasamos
        los datos para el pago y agendamos la entrega. No se cobra nada desde el sitio.
      </p>
    </div>
  );
}
