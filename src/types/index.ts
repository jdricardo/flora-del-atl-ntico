/**
 * Modelo de datos de Flora del Atlántico.
 *
 * Las interfaces están pensadas para que, al conectar un backend real,
 * el contrato de la API pueda replicarlas 1:1 y los componentes no cambien.
 */

/* ============================== Catálogo ============================== */

export const CATEGORY_SLUGS = [
  'arreglos-caja',
  'arreglos-base',
  'ramos-clasicos',
  'ramos-premium',
  'ramos-tropicales',
  'arreglos-funebres',
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type ProductBadge = 'nuevo' | 'bestseller' | 'edicion-limitada' | 'premium';

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  cta: string;
}

export interface Product {
  /** Slug legible usado como identificador y en la URL: /producto/bouquet-aurora */
  id: string;
  sku: string;
  name: string;
  category: CategorySlug;
  /** Colección editorial a la que pertenece (Atelier, Eterna, Casa...) */
  collection: string;
  /** Precio de venta en pesos colombianos, sin decimales. */
  price: number;
  /** Precio de lista cuando el producto está en promoción. */
  compareAtPrice?: number;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  care: string[];
  badges: ProductBadge[];
  stock: number;
  /** Elegible para entrega el mismo día en ciudades con cobertura. */
  sameDayDelivery: boolean;
  rating: number;
  reviewCount: number;
  /** Términos adicionales que alimentan el buscador (flores, colores, ocasiones). */
  tags: string[];
  /** ISO date. Ordena el filtro "Más recientes". */
  createdAt: string;
  /** Unidades vendidas. Ordena el filtro "Más vendidos". */
  salesCount: number;
}

/* ============================== Filtros ============================== */

export const SORT_OPTIONS = ['destacados', 'mas-vendidos', 'precio-asc', 'precio-desc', 'recientes'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type PriceBucketId = 'hasta-150' | '150-250' | '250-400' | 'mas-400';

export interface PriceBucket {
  id: PriceBucketId;
  label: string;
  min: number;
  max: number | null;
}

export type AvailabilityFilterId = 'en-stock' | 'mismo-dia' | 'en-promocion';

export interface CatalogQuery {
  category: CategorySlug | 'todos';
  priceBuckets: PriceBucketId[];
  availability: AvailabilityFilterId[];
  sort: SortOption;
  search: string;
}

/* ============================== Carrito ============================== */

export interface CartItemOptions {
  /** ISO date (yyyy-mm-dd) elegida para la entrega. */
  deliveryDate: string | null;
  cityId: string | null;
  dedication: string;
  /** Tarjeta manuscrita opcional, con costo adicional. */
  giftCard: boolean;
}

export interface CartItem {
  /** Identifica la línea del carrito: mismo producto con distintas opciones = 2 líneas. */
  lineId: string;
  product: Product;
  quantity: number;
  options: CartItemOptions;
}

export interface CartTotals {
  subtotal: number;
  giftCards: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
}

/* ============================== Entrega ============================== */

export interface City {
  id: string;
  name: string;
  department: string;
  /** Cobertura de entrega el mismo día. */
  sameDay: boolean;
  shippingCost: number;
  /** Solo recibe flores preservadas y regalos (no flor fresca). */
  preservedOnly: boolean;
}

export interface DeliverySlot {
  id: string;
  label: string;
  range: string;
}

/* ============================== Pedido ============================== */

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  cityId: string;
  line1: string;
  complement: string;
  neighborhood: string;
}

export interface DeliveryDetails {
  date: string;
  slotId: string;
  dedication: string;
}

export type PaymentMethodId = 'tarjeta' | 'pse' | 'nequi' | 'transferencia';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  icon: string;
}

export type OrderStatus = 'confirmado' | 'en-preparacion' | 'en-ruta' | 'entregado';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  customer: Customer;
  address: Address;
  delivery: DeliveryDetails;
  paymentMethod: PaymentMethodId;
  totals: CartTotals;
}

/* ============================== Contenido ============================== */

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  occasion: string;
  rating: number;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface InspirationPost {
  id: string;
  image: string;
  caption: string;
  href: string;
}

/* ============================== UI ============================== */

export type ToastVariant = 'success' | 'info' | 'error';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  image?: string;
  /** Acción opcional: navega con `to` o ejecuta `onClick`. */
  action?: { label: string; to?: string; onClick?: () => void };
}
