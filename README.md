# Flora del Atlántico

E-commerce de distribuidora y floristería con más de 20 años de experiencia. Ubicada en Malambo, Atlántico, con cobertura de envíos a zona metropolitana, oriental del Atlántico y región Caribe colombiana.

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Typecheck + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Solo verificación de tipos |
| `npm run lint` | Oxlint |
| `npm run placeholders` | Regenera las imágenes placeholder SVG |
| `npm run build:preview` | Demo estática en un único HTML (`dist-preview/`) |

## Tecnologías

- **React 19** + **TypeScript 6** (modo estricto, sin `any`)
- **Vite 8** con alias `@/` → `src/`
- **Tailwind CSS 4** — configuración CSS-first en `src/index.css` (`@theme`)
- **React Router 7** — rutas y estado de filtros en la URL
- **Zustand 5** con `persist` — carrito, favoritos y último pedido en `localStorage`
- **Context API** — sistema de notificaciones (toasts)
- **Lucide React** — iconografía
- `clsx` + `tailwind-merge` para composición de clases

## Estructura

```
src/
├─ assets/images/       90 SVG placeholder generados (reemplazables por fotografía)
├─ components/
│  ├─ ui/               Button, Dialog, Field, Accordion, Skeleton, Toast, Price…
│  ├─ layout/           PromoBar, Header, MobileMenu, Footer, Logo, ScrollToTop
│  ├─ product/          ProductCard, ProductGrid, ProductGallery, ProductFilters,
│  │                    PurchasePanel, ProductInfoTabs, WishlistButton, RelatedProducts
│  ├─ cart/             CartDrawer, CartLine, CartSummary
│  ├─ checkout/         CheckoutSection, CheckoutSummary, PaymentMethods
│  ├─ search/           SearchModal
│  ├─ home/             Hero, CategoryGrid, FeaturedProducts, EditorialSection,
│  │                    Benefits, HowItWorks, Testimonials, InspirationGallery, FaqSection
│  └─ common/           CityModal, WhatsAppButton
├─ context/             ToastContext
├─ data/                products, categories, cities, content, navigation, site, images
├─ hooks/               useCatalogQuery, useAddToCart, useSeo, useDebouncedValue,
│                       useMediaQuery, useDialogBehavior, useReveal, useDeferredCatalog
├─ layouts/             RootLayout
├─ lib/                 catalog, filters, search, shipping, validation, dates, format, id, cn
├─ pages/               Home, Shop, Product, Wishlist, Checkout, OrderConfirmed,
│                       About, Contact, NotFound
├─ store/               useCartStore, useWishlistStore, useUiStore, useOrderStore
└─ types/               Product, Category, CartItem, Customer, Address, Order…
```

Regla de dependencias: `pages` → `components` → `hooks`/`store`/`lib` → `data`/`types`.
Ningún componente importa de otro componente hermano de nivel superior.

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Home |
| `/tienda` | Catálogo con filtros (`?categoria=`, `?precio=`, `?disponibilidad=`, `?orden=`, `?q=`) |
| `/producto/:id` | Ficha de producto |
| `/favoritos` | Wishlist |
| `/checkout` | Checkout |
| `/pedido-confirmado` | Confirmación |
| `/nosotros`, `/contacto` | Contenido |
| `*` | 404 |

## Funcionalidades implementadas

Navegación y routing · menú hamburguesa en móvil · buscador instantáneo (⌘K) con
ranking por relevancia · filtros por categoría, precio, disponibilidad y orden
sincronizados con la URL · drawer de filtros en móvil · carrito lateral con
cantidades, eliminación, subtotal, envío y total · persistencia en `localStorage`
(revalidada contra el catálogo al rehidratar) · favoritos persistentes · selección
de fecha y ciudad de entrega · dedicatoria con contador · tarjeta opcional ·
checkout con validación completa (incluye Luhn) y estados de error por campo ·
métodos de pago simulados (tarjeta, PSE, Nequi, transferencia) · confirmación de
pedido · toasts, skeletons, estados vacíos y microanimaciones · SEO por página
(title, description, canonical, Open Graph, JSON-LD) · accesibilidad (foco
atrapado en diálogos, `aria-*`, navegación por teclado, skip link).

## Personalización

- **Marca, contacto y reglas comerciales:** `src/data/site.ts`
- **Paleta, tipografías y animaciones:** bloque `@theme` en `src/index.css`
- **Catálogo:** `src/data/products.ts`
- **Ciudades y costos de envío:** `src/data/cities.ts`
- **Contenido editorial (beneficios, pasos, testimonios, FAQ):** `src/data/content.ts`
- **Menús:** `src/data/navigation.ts`
- **Imágenes:** deja el archivo en `src/assets/images/` con el mismo nombre
  (`bouquet-aurora-1.jpg`, etc.). El glob de `src/data/images.ts` ya acepta
  `svg`, `jpg`, `png`, `webp` y `avif`.

## Puntos de integración con backend

| Área | Dónde | Qué cambiar |
| --- | --- | --- |
| Catálogo | `src/lib/catalog.ts` | `getAllProducts`, `getProductById` → `GET /api/products` |
| Búsqueda | `src/lib/search.ts` | `searchProducts` → `GET /api/products?q=` |
| Filtros | `src/lib/filters.ts` | Mover el filtrado al servidor manteniendo `CatalogQuery` |
| Carrito | `src/store/useCartStore.ts` | Sustituir el snapshot local por un carrito del servidor |
| Envíos | `src/lib/shipping.ts` | `calculateTotals` debe calcularse en el backend |
| Pedido | `src/pages/CheckoutPage.tsx` | `POST /api/orders` + intención de pago |
| Pagos | `src/components/checkout/PaymentMethods.tsx` | Wompi / Mercado Pago / PayU |
| Inventario | `Product.stock` | Verificación de stock al agregar y al confirmar |
| Newsletter | `src/components/layout/Footer.tsx` | `POST /api/newsletter` |
| Contacto | `src/pages/ContactPage.tsx` | `POST /api/contact` |
| WhatsApp | `src/data/site.ts` | `whatsappLink()` o WhatsApp Business API |
| Usuarios | Header, `/favoritos` | Auth + sincronización de favoritos y direcciones |

## Pendiente para producción

SSR o prerender para SEO real (Next.js / Remix) · code splitting por ruta ·
paginación o scroll infinito en la tienda · reseñas reales de producto ·
área de cuenta y seguimiento de pedidos · analítica y píxeles ·
i18n y multimoneda · pruebas automatizadas (Vitest + Testing Library + Playwright) ·
sustitución de los placeholders por fotografía real y optimización a AVIF/WebP.

---

Contenido, marca, productos, precios y opiniones son ficticios y sirven solo de
demostración. Las imágenes son composiciones generadas para este proyecto.
