export interface NavItem {
  label: string;
  to: string;
}

/** Menú principal. `/tienda` acepta el parámetro `categoria`. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Tienda', to: '/tienda' },
  { label: 'Ramos clásicos', to: '/tienda?categoria=ramos-clasicos' },
  { label: 'Arreglos en caja', to: '/tienda?categoria=arreglos-caja' },
  { label: 'Arreglos en base', to: '/tienda?categoria=arreglos-base' },
  { label: 'Tropicales', to: '/tienda?categoria=ramos-tropicales' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Catálogo',
    items: [
      { label: 'Toda la tienda', to: '/tienda' },
      { label: 'Arreglos en caja', to: '/tienda?categoria=arreglos-caja' },
      { label: 'Arreglos en base', to: '/tienda?categoria=arreglos-base' },
      { label: 'Ramos clásicos', to: '/tienda?categoria=ramos-clasicos' },
      { label: 'Ramos premium', to: '/tienda?categoria=ramos-premium' },
      { label: 'Ramos tropicales', to: '/tienda?categoria=ramos-tropicales' },
    ],
  },
  {
    title: 'Atención al cliente',
    items: [
      { label: 'Preguntas frecuentes', to: '/contacto#faq' },
      { label: 'Seguimiento de pedido', to: '/contacto' },
      { label: 'Envíos y coberturas', to: '/contacto' },
      { label: 'Cambios y devoluciones', to: '/contacto' },
      { label: 'Pedidos corporativos', to: '/contacto' },
    ],
  },
  {
    title: 'La casa',
    items: [
      { label: 'Nosotros', to: '/nosotros' },
      { label: 'El taller', to: '/nosotros#taller' },
      { label: 'Sostenibilidad', to: '/nosotros#sostenibilidad' },
      { label: 'Mis favoritos', to: '/favoritos' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Términos y condiciones', to: '/contacto' },
      { label: 'Política de privacidad', to: '/contacto' },
      { label: 'Política de cookies', to: '/contacto' },
      { label: 'Tratamiento de datos', to: '/contacto' },
    ],
  },
];

/** Medios de pago que recibe la floristería, según el catálogo. */
export const PAYMENT_LOGOS = ['Transferencia', 'Efectivo'];
