export interface NavItem {
  label: string;
  to: string;
}

/** Menú principal. `/tienda` acepta el parámetro `categoria`. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Tienda', to: '/tienda' },
  { label: 'Flores frescas', to: '/tienda?categoria=flores-frescas' },
  { label: 'Flores eternas', to: '/tienda?categoria=flores-eternas' },
  { label: 'Regalos', to: '/tienda?categoria=regalos' },
  { label: 'Hogar', to: '/tienda?categoria=hogar' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Colección',
    items: [
      { label: 'Toda la tienda', to: '/tienda' },
      { label: 'Flores frescas', to: '/tienda?categoria=flores-frescas' },
      { label: 'Flores eternas', to: '/tienda?categoria=flores-eternas' },
      { label: 'Regalos', to: '/tienda?categoria=regalos' },
      { label: 'Hogar', to: '/tienda?categoria=hogar' },
      { label: 'Más vendidos', to: '/tienda?orden=mas-vendidos' },
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

export const PAYMENT_LOGOS = ['Visa', 'Mastercard', 'Amex', 'PSE', 'Nequi', 'Bancolombia'];
