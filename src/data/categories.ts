import type { Category, CategorySlug } from '@/types';
import { img } from './images';

export const CATEGORIES: Category[] = [
  {
    slug: 'flores-frescas',
    name: 'Flores frescas',
    tagline: 'Cortadas esta mañana',
    description:
      'Composiciones de temporada armadas el mismo día con flor de la sabana. Duran entre siete y diez días con los cuidados adecuados.',
    image: img('categoria-flores-frescas'),
    cta: 'Ver flores frescas',
  },
  {
    slug: 'flores-eternas',
    name: 'Flores eternas',
    tagline: 'Duran hasta tres años',
    description:
      'Rosas y follaje preservados de forma natural, sin agua y sin mantenimiento. Viajan a cualquier rincón de Colombia.',
    image: img('categoria-flores-eternas'),
    cta: 'Ver flores eternas',
  },
  {
    slug: 'amor-y-amistad',
    name: 'Amor y Amistad',
    tagline: 'Celebra el amor',
    description:
      'Arreglos especiales para celebrar el amor y la amistad. Rosas rojas, tropicales vibrantes y detalles románticos que expresan tus sentimientos.',
    image: img('categoria-amor-y-amistad'),
    cta: 'Ver amor y amistad',
  },
  {
    slug: 'hogar',
    name: 'Hogar',
    tagline: 'Objetos que acompañan',
    description:
      'Floreros de cerámica, velas de cera vegetal y piezas de mesa hechas por talleres colombianos.',
    image: img('categoria-hogar'),
    cta: 'Ver objetos',
  },
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'flores-frescas': 'Flores frescas',
  'flores-eternas': 'Flores eternas',
  'amor-y-amistad': 'Amor y Amistad',
  hogar: 'Hogar',
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
