import { CITIES } from '@/data/cities';
import { DELIVERY_SLOTS, PAYMENT_METHODS, SITE } from '@/data/site';
import { formatCOP } from './format';
import { formatLongDate } from './dates';
import type { CartItem, CartTotals, Product } from '@/types';

/** Límite conservador: algunos navegadores truncan URLs muy largas. */
const MAX_URL_LENGTH = 6000;

function label<T extends { id: string; name?: string; label?: string }>(
  list: readonly T[],
  id: string,
): string {
  const found = list.find((item) => item.id === id);
  return found?.name ?? found?.label ?? id;
}

function buildUrl(mensaje: string): string {
  const url = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  if (url.length <= MAX_URL_LENGTH) return url;

  // Pedido muy largo: se recorta el detalle y la floristería lo completa en el chat.
  const recortado = `${mensaje.slice(0, 1500)}\n\n[...] El pedido completo tiene más productos; te los detallo por aquí.`;
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(recortado)}`;
}

/** Consulta rápida desde la ficha de producto, sin pasar por el carrito. */
export function productEnquiryUrl(product: Product): string {
  const mensaje = [
    `Hola, estoy interesado en este arreglo de ${SITE.name}:`,
    '',
    `*${product.name}*`,
    `Referencia: ${product.sku}`,
    product.price > 0 ? `Precio: ${formatCOP(product.price)}` : 'Precio: a confirmar',
    '',
    '¿Me confirmas disponibilidad?',
  ].join('\n');

  return buildUrl(mensaje);
}

interface OrderMessageInput {
  orderId: string;
  items: CartItem[];
  totals: CartTotals;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: { cityId: string; line1: string; complement: string; neighborhood: string };
  delivery: { date: string; slotId: string; dedication: string };
  paymentMethod: string;
}

/**
 * Arma el pedido completo como mensaje de WhatsApp.
 *
 * El formato está pensado para que la floristería pueda leerlo de un vistazo
 * en el celular: encabezados en negrita, un bloque por producto y los totales
 * al final. Los asteriscos son el formato de negrita de WhatsApp.
 */
export function orderMessageUrl(order: OrderMessageInput): string {
  const { customer, address, delivery, totals } = order;

  const lineas: string[] = [
    `*NUEVO PEDIDO* · ${order.orderId}`,
    `_${SITE.name}_`,
    '',
    '*PRODUCTOS*',
  ];

  for (const item of order.items) {
    lineas.push(
      `• ${item.quantity} × ${item.product.name} (${item.product.sku})`,
      `   ${formatCOP(item.product.price * item.quantity)}`,
    );
  }

  lineas.push(
    '',
    '*CLIENTE*',
    `${customer.firstName} ${customer.lastName}`,
    `Cel: ${customer.phone}`,
    `Correo: ${customer.email}`,
    '',
    '*ENTREGA*',
    `${address.line1}${address.complement ? `, ${address.complement}` : ''}`,
    `Barrio ${address.neighborhood}`,
    label(CITIES, address.cityId),
    `Fecha: ${formatLongDate(delivery.date)}`,
    `Franja: ${label(DELIVERY_SLOTS, delivery.slotId)}`,
  );

  if (delivery.dedication) {
    lineas.push('', '*DEDICATORIA*', `"${delivery.dedication}"`);
  }

  lineas.push(
    '',
    '*TOTALES*',
    `Subtotal: ${formatCOP(totals.subtotal)}`,
  );

  if (totals.giftCards > 0) {
    lineas.push(`Tarjeta: ${formatCOP(totals.giftCards)}`);
  }

  lineas.push(
    `Domicilio: ${totals.shipping === 0 ? 'Gratis' : formatCOP(totals.shipping)}`,
    `*TOTAL: ${formatCOP(totals.total)}*`,
    '',
    `Pago: ${label(PAYMENT_METHODS, order.paymentMethod)}`,
  );

  return buildUrl(lineas.join('\n'));
}
