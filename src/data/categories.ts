import type { Category, CategorySlug } from '@/types';
import { img } from './images';

export const CATEGORIES: Category[] = [
  {
    slug: 'arreglos-caja',
    name: 'Arreglos en caja',
    tagline: 'Listos para regalar',
    description:
      'Cajas redondas, de corazón y rectangulares armadas con rosas, girasoles y flor tropical. Varias incluyen globo, peluche o chocolates.',
    image: img('categoria-arreglos-caja'),
    cta: 'Ver arreglos en caja',
  },
  {
    slug: 'arreglos-base',
    name: 'Arreglos en base',
    tagline: 'Para dejar puestos',
    description:
      'Composiciones montadas en base de vidrio o taza, pensadas para que lleguen listas y se queden en la mesa sin nada más que agua.',
    image: img('categoria-arreglos-base'),
    cta: 'Ver arreglos en base',
  },
  {
    slug: 'ramos-clasicos',
    name: 'Ramos clásicos',
    tagline: 'De una rosa a cuatro docenas',
    description:
      'Rosas y girasoles envueltos en papel coreano, desde la unidad hasta el ramo de 48. El clásico que nunca falla, en el tamaño que necesites.',
    image: img('categoria-ramos-clasicos'),
    cta: 'Ver ramos clásicos',
  },
  {
    slug: 'ramos-premium',
    name: 'Ramos premium',
    tagline: 'Cuando es una ocasión grande',
    description:
      'Nuestras piezas más elaboradas: espejo conmemorativo rodeado de rosas y ramos en forma de corazón. Para aniversarios y celebraciones que se recuerdan.',
    image: img('categoria-ramos-premium'),
    cta: 'Ver ramos premium',
  },
  {
    slug: 'ramos-tropicales',
    name: 'Ramos tropicales',
    tagline: 'Color de la costa',
    description:
      'Mezclas de gerberas, lirios, hortensias y astromelias en toda la paleta. Para quien prefiere el color antes que la rosa roja.',
    image: img('categoria-ramos-tropicales'),
    cta: 'Ver ramos tropicales',
  },
  {
    slug: 'arreglos-funebres',
    name: 'Arreglos fúnebres',
    tagline: 'Acompañamos el adiós',
    description:
      'Coronas, corazones, cruces y arreglos sobre cajón para velaciones y exequias. Armamos y entregamos en sala el mismo día. Escríbenos y te cotizamos según el tamaño y la flor disponible.',
    image: img('categoria-arreglos-funebres'),
    cta: 'Ver arreglos fúnebres',
  },
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'arreglos-caja': 'Arreglos en caja',
  'arreglos-base': 'Arreglos en base',
  'ramos-clasicos': 'Ramos clásicos',
  'ramos-premium': 'Ramos premium',
  'ramos-tropicales': 'Ramos tropicales',
  'arreglos-funebres': 'Arreglos fúnebres',
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
