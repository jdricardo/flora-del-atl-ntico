import { CircleCheck, Mail, MapPin, MessageCircle, PenLine } from 'lucide-react';
import { cityName } from '@/data/cities';
import { DELIVERY_SLOTS, PAYMENT_METHODS, whatsappLink } from '@/data/site';
import { formatLongDate } from '@/lib/dates';
import { useSeo } from '@/hooks/useSeo';
import { useOrderStore } from '@/store/useOrderStore';
import { Container } from '@/components/ui/Container';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';

export function OrderConfirmedPage() {
  const order = useOrderStore((state) => state.lastOrder);
  const clearLastOrder = useOrderStore((state) => state.clearLastOrder);

  useSeo({ title: 'Pedido confirmado', path: '/pedido-confirmado', noindex: true });

  if (!order) {
    return (
      <Container className="py-24">
        <EmptyState
          icon="package"
          title="No hay un pedido reciente"
          description="Cuando completes una compra, la confirmación aparecerá aquí."
          action={<ButtonLink to="/tienda">Ver la colección</ButtonLink>}
        />
      </Container>
    );
  }

  const slot = DELIVERY_SLOTS.find((item) => item.id === order.delivery.slotId);
  const payment = PAYMENT_METHODS.find((item) => item.id === order.paymentMethod);

  return (
    <Container className="pt-12 pb-24 lg:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-olive-100 px-3.5 py-1.5 text-[0.68rem] font-medium tracking-[0.12em] text-olive-700 uppercase">
              <CircleCheck className="size-3.5" aria-hidden="true" />
              Pedido confirmado
            </span>
            <h1 className="text-4xl sm:text-5xl">Gracias, {order.customer.firstName}</h1>
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">
              Tu pedido <strong className="font-medium text-ink">{order.id}</strong> quedó registrado. Te enviamos la
              confirmación a {order.customer.email} y te escribimos por WhatsApp cuando salga del taller.
            </p>
          </div>

          <dl className="grid gap-6 rounded-2xl border border-line p-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="eyebrow">Entrega</dt>
              <dd className="text-sm">
                {formatLongDate(order.delivery.date)}
                <br />
                <span className="text-ink-muted">{slot ? `${slot.label} · ${slot.range}` : 'Franja por confirmar'}</span>
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="eyebrow">Dirección</dt>
              <dd className="flex gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-clay" aria-hidden="true" />
                <span>
                  {order.address.line1}
                  {order.address.complement && `, ${order.address.complement}`}
                  <br />
                  <span className="text-ink-muted">
                    {order.address.neighborhood} · {cityName(order.address.cityId)}
                  </span>
                </span>
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="eyebrow">Pago</dt>
              <dd className="text-sm">
                {payment?.name ?? 'Por confirmar'}
                <br />
                <span className="text-ink-muted">Demostración · sin cargo real</span>
              </dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="eyebrow">Contacto</dt>
              <dd className="text-sm">
                {order.customer.firstName} {order.customer.lastName}
                <br />
                <span className="text-ink-muted">{order.customer.phone}</span>
              </dd>
            </div>

            {order.delivery.dedication && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="eyebrow">Dedicatoria</dt>
                <dd className="flex gap-2 font-serif text-lg leading-snug italic">
                  <PenLine className="mt-1.5 size-4 shrink-0 text-clay not-italic" aria-hidden="true" />
                  “{order.delivery.dedication}”
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/tienda">Seguir comprando</ButtonLink>
            <ButtonLink href={whatsappLink(`Hola, quiero consultar por mi pedido ${order.id}.`)} variant="secondary">
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar por WhatsApp
            </ButtonLink>
            <Button variant="ghost" onClick={clearLastOrder}>
              Ocultar esta confirmación
            </Button>
          </div>

          <p className="flex items-center gap-2 text-xs text-ink-muted">
            <Mail className="size-3.5" aria-hidden="true" />
            En la versión con backend, aquí se dispararía el correo transaccional y el registro en el ERP.
          </p>
        </div>

        <aside aria-label="Detalle del pedido">
          <CheckoutSummary items={order.items} totals={order.totals} cityId={order.address.cityId} readOnly />
        </aside>
      </div>
    </Container>
  );
}
