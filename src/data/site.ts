import type { DeliverySlot, PaymentMethod } from '@/types';

/**
 * Configuración de marca y reglas comerciales.
 * Un único lugar para cambiar nombre, contacto, costos y textos legales.
 */
export const SITE = {
  name: 'Flora del Atlántico',
  shortName: 'Flora',
  tagline: 'Distribuidora y Floristería',
  claim: 'Más de 20 años llevando flores frescas a tu hogar',
  description:
    'Distribuidora y floristería con más de 20 años de experiencia en Malambo. Arreglos florales, flores frescas y detalles especiales con envíos a Barranquilla, zona metropolitana y oriental del Atlántico.',
  url: 'https://floradelatlantico.co',
  founded: 2003,
  atelier: {
    street: 'Calle 8 #12-03',
    neighborhood: 'Centro',
    city: 'Malambo, Atlántico',
    hours: 'Lunes a sábado · 8:00 a.m. – 6:00 p.m.',
  },
  contact: {
    email: 'contacto@floradelatlantico.co',
    phone: '+57 300 2946740',
    /**
     * Número al que llegan los pedidos, en formato internacional y solo
     * dígitos: así lo exige el enlace wa.me.
     */
    whatsapp: '@jdricardo99',
  },
  social: {
    instagram: 'https://instagram.com/floradelatlantico',
    facebook: 'https://facebook.com/floradelatlantico',
    pinterest: 'https://pinterest.com/floradelatlantico',
    youtube: 'https://youtube.com/@floradelatlantico',
  },
} as const;

/** Reglas de envío. Al conectar el backend estas quedan del lado del servidor. */
export const SHIPPING = {
  /** Compras iguales o superiores a este valor no pagan envío. */
  freeThreshold: 250_000,
  /** Costo por defecto cuando no se ha elegido ciudad: tarifa del resto del Atlántico. */
  defaultCost: 10_000,
} as const;

/** Costo de la tarjeta manuscrita opcional. */
export const GIFT_CARD_PRICE = 12_000;

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'manana', label: 'Mañana', range: '8:00 a.m. – 12:00 m.' },
  { id: 'tarde', label: 'Tarde', range: '12:00 m. – 5:00 p.m.' },
  { id: 'noche', label: 'Noche', range: '5:00 p.m. – 8:00 p.m.' },
];

/**
 * Medios de pago que recibe la floristería. El pedido se cierra por WhatsApp,
 * así que aquí solo se declara la preferencia: los datos para transferir se
 * acuerdan en el chat.
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'transferencia',
    name: 'Transferencia bancaria',
    description: 'Te pasamos los datos por WhatsApp. El pedido se agenda con el comprobante.',
    icon: 'landmark',
  },
  {
    id: 'efectivo',
    name: 'Efectivo',
    description: 'Pagas contra entrega, al recibir el arreglo.',
    icon: 'banknote',
  },
];

/** Textos compartidos por todas las fichas de producto. */
export const PRODUCT_POLICIES = {
  shipping: [
    'Entregamos únicamente en el departamento del Atlántico.',
    'Entrega el mismo día en todo el departamento para pedidos antes de las 12:00 m.',
    'Domicilio: Malambo $5.000 · Resto del Atlántico $10.000 · Soledad $15.000 · Barranquilla $20.000 · Puerto Colombia $30.000.',
    'Puedes elegir fecha y franja horaria de entrega en el checkout.',
  ],
  returns: [
    'Si la composición llega en mal estado, escríbenos dentro de las 24 horas siguientes con una fotografía y la reponemos sin costo.',
    'Los productos de flor fresca no admiten cambio por gusto o color, ya que son perecederos.',
    'Regalos y objetos para el hogar admiten cambio dentro de los 5 días siguientes a la entrega, sin uso y en su empaque original.',
    'La devolución del dinero se realiza por el mismo medio de pago en un plazo de hasta 10 días hábiles.',
  ],
} as const;

/** Enlace de WhatsApp con mensaje prellenado. */
export function whatsappLink(message = 'Hola, quiero información sobre Flora del Atlántico.'): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
