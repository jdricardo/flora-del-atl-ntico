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
    phone: '+57 320 000 0000',
    /** Solo dígitos: se usa para construir el enlace de WhatsApp. */
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
  /** Costo por defecto cuando no se ha elegido ciudad. */
  defaultCost: 18_000,
} as const;

/** Costo de la tarjeta manuscrita opcional. */
export const GIFT_CARD_PRICE = 12_000;

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'manana', label: 'Mañana', range: '8:00 a.m. – 12:00 m.' },
  { id: 'tarde', label: 'Tarde', range: '12:00 m. – 5:00 p.m.' },
  { id: 'noche', label: 'Noche', range: '5:00 p.m. – 8:00 p.m.' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'tarjeta',
    name: 'Tarjeta de crédito o débito',
    description: 'Visa, Mastercard y American Express',
    icon: 'credit-card',
  },
  { id: 'pse', name: 'PSE', description: 'Débito desde tu cuenta bancaria', icon: 'building-2' },
  { id: 'nequi', name: 'Nequi', description: 'Aprueba el pago desde la app', icon: 'smartphone' },
  {
    id: 'transferencia',
    name: 'Transferencia bancaria',
    description: 'Bancolombia · Davivienda · Nu',
    icon: 'landmark',
  },
];

/** Textos compartidos por todas las fichas de producto. */
export const PRODUCT_POLICIES = {
  shipping: [
    'Entrega el mismo día en Malambo, Soledad y Barranquilla para pedidos antes de las 12:00 p.m.',
    'Cobertura completa en zona metropolitana y oriental del Atlántico: Malambo, Soledad, Barranquilla, Puerto Colombia, Sabanalarga, Galapa, Santo Tomás, Palmar de Varela y más.',
    'Envíos a Cartagena, Santa Marta y otras ciudades de la costa Caribe en 1 a 3 días hábiles.',
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
