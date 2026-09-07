import type { Benefit, FaqItem, InspirationPost, ProcessStep, Testimonial } from '@/types';
import { img } from './images';

/** `icon` corresponde a una clave del registro de iconos en `components/ui/Icon.tsx`. */
export const BENEFITS: Benefit[] = [
  {
    id: 'experiencia',
    icon: 'award',
    title: 'Más de 20 años de experiencia',
    description: 'Distribuidora y floristería con trayectoria consolidada en la zona atlántica. Calidad garantizada.',
  },
  {
    id: 'entrega',
    icon: 'truck',
    title: 'Entrega el mismo día',
    description: 'Pedidos antes de las 12:00 p.m. llegan hoy en Malambo, Barranquilla y zona metropolitana del Atlántico.',
  },
  {
    id: 'seleccion',
    icon: 'sparkles',
    title: 'Flores frescas del Caribe',
    description: 'Como distribuidores, garantizamos flores frescas y variedades tropicales de la mejor calidad.',
  },
  {
    id: 'artesanal',
    icon: 'hand',
    title: 'Elaboración artesanal',
    description: 'Cada arreglo se elabora a mano con dedicación, el mismo día del despacho.',
  },
  {
    id: 'atencion',
    icon: 'headset',
    title: 'Atención personalizada',
    description: 'Contacto directo por WhatsApp. Te ayudamos a elegir el arreglo perfecto para cada ocasión.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'elige',
    step: '01',
    title: 'Elige tu arreglo',
    description: 'Explora nuestra colección por categoría, ocasión o presupuesto. Cada producto incluye descripción detallada.',
  },
  {
    id: 'fecha',
    step: '02',
    title: 'Selecciona fecha de entrega',
    description: 'Escoge el día y la franja horaria que prefieras. Entrega el mismo día en la zona metropolitana.',
  },
  {
    id: 'dedicatoria',
    step: '03',
    title: 'Agrega tu mensaje',
    description: 'Escribe una dedicatoria especial y la incluimos en una tarjeta manuscrita sin costo adicional.',
  },
  {
    id: 'recibe',
    step: '04',
    title: 'Recibe tu pedido',
    description: 'Confirmamos cuando tu arreglo sale de Malambo y te notificamos al momento de la entrega.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'María Ospino',
    city: 'Barranquilla',
    occasion: 'Aniversario',
    rating: 5,
    quote:
      'Pedí en la mañana desde Barranquilla y antes del mediodía ya estaba en mi casa. Las flores llegaron frescas y hermosas, tal como se veían en las fotos.',
  },
  {
    id: 't2',
    name: 'Carlos Dávila',
    city: 'Soledad',
    occasion: 'Cumpleaños de mi mamá',
    rating: 5,
    quote:
      'Excelente servicio. Escribí por WhatsApp y me ayudaron a elegir. El arreglo quedó precioso y mi mamá quedó feliz. Totalmente recomendado.',
  },
  {
    id: 't3',
    name: 'Lucia Martínez',
    city: 'Malambo',
    occasion: 'Regalo corporativo',
    rating: 5,
    quote:
      'Envié varios arreglos a clientes en diferentes ciudades de la costa y todos llegaron a tiempo y en perfecto estado. Muy profesionales.',
  },
  {
    id: 't4',
    name: 'Andrés Villalba',
    city: 'Santa Marta',
    occasion: 'Propuesta de matrimonio',
    rating: 5,
    quote:
      'Las rosas llegaron perfectas a Santa Marta. Se coordinaron conmigo para la entrega exacta y todo salió como lo planeé. Eternamente agradecido.',
  },
  {
    id: 't5',
    name: 'Diana Consuegra',
    city: 'Puerto Colombia',
    occasion: 'Decoración de casa',
    rating: 5,
    quote:
      'Compré un arreglo para mi sala y duró más de una semana. Las flores estaban súper frescas. Sin duda vuelvo a comprar.',
  },
  {
    id: 't6',
    name: 'Jorge Insignares',
    city: 'Cartagena',
    occasion: 'Condolencias',
    rating: 5,
    quote:
      'En un momento difícil, Flora del Atlántico respondió rápido. El arreglo fue sobrio y elegante, justo lo que necesitaba. Gracias.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Hasta qué hora puedo pedir para que llegue hoy?',
    answer:
      'Hasta las 12:00 p.m. en Malambo, Soledad, Barranquilla y zona metropolitana, de lunes a sábado. Después de esa hora el pedido se programa para el día siguiente. Los domingos trabajamos solo con entregas programadas.',
  },
  {
    id: 'faq-2',
    question: '¿A qué ciudades envían?',
    answer:
      'Enviamos flores frescas a Barranquilla, zona metropolitana y oriental del Atlántico (Malambo, Soledad, Galapa, Puerto Colombia, Sabanalarga, Santo Tomás, Palmar de Varela). También cubrimos Cartagena, Santa Marta, Sincelejo, Valledupar, Montería y otras ciudades del Caribe colombiano.',
  },
  {
    id: 'faq-3',
    question: '¿Cuánto duran las flores frescas?',
    answer:
      'Entre siete y diez días si cambias el agua cada dos días y las mantienes en un lugar fresco, alejadas del sol directo. Cada pedido incluye instrucciones de cuidado.',
  },
  {
    id: 'faq-4',
    question: '¿Cuánto cuesta el envío?',
    answer:
      'El costo de envío varía según la ciudad: desde $8.000 en Malambo hasta $40.000 en ciudades más alejadas del Caribe. El costo exacto lo ves en el checkout al seleccionar tu ciudad.',
  },
  {
    id: 'faq-5',
    question: '¿Puedo enviar una dedicatoria?',
    answer:
      'Sí. Escribe tu mensaje en el checkout y lo transcribimos a mano en una tarjeta sin costo adicional. Es el toque personal que hace especial tu regalo.',
  },
  {
    id: 'faq-6',
    question: '¿Qué pasa si la persona no está en casa?',
    answer:
      'Nuestro mensajero intenta contactar al destinatario y, si no responde, te llamamos para reprogramar. El primer reintento del mismo día no tiene costo adicional.',
  },
  {
    id: 'faq-7',
    question: '¿Hacen pedidos corporativos o para eventos?',
    answer:
      'Sí. Trabajamos arreglos florales para eventos, ambientaciones, centros de mesa y envíos corporativos. Contáctanos por WhatsApp o al correo contacto@floradelatlantico.co para cotización.',
  },
  {
    id: 'faq-8',
    question: '¿Puedo cambiar o cancelar un pedido?',
    answer:
      'Puedes modificar fecha, dirección o dedicatoria hasta 12 horas antes de la entrega. Una vez el arreglo entra en producción no es posible cancelarlo porque las flores se cortan especialmente para tu pedido.',
  },
];

export const INSPIRATION_POSTS: InspirationPost[] = [
  { id: 'i1', image: img('inspiracion-1'), caption: 'Detrás del mostrador, un martes cualquiera', href: '#' },
  { id: 'i2', image: img('inspiracion-2'), caption: 'Rosa empolvado y hoja de higuera', href: '#' },
  { id: 'i3', image: img('inspiracion-3'), caption: 'Montaje para una boda en Guasca', href: '#' },
  { id: 'i4', image: img('inspiracion-4'), caption: 'La mesa del taller a las siete de la mañana', href: '#' },
  { id: 'i5', image: img('inspiracion-5'), caption: 'Preservación en curso', href: '#' },
  { id: 'i6', image: img('inspiracion-6'), caption: 'Nueva colección Eterna', href: '#' },
];

/** Mensajes de la barra promocional superior. */
export const PROMO_MESSAGES: string[] = [
  'Más de 20 años de experiencia · Distribuidora y Floristería en Malambo',
  'Envíos el mismo día en zona metropolitana y oriental del Atlántico',
  'Dedicatoria manuscrita incluida sin costo en todos los pedidos',
];
