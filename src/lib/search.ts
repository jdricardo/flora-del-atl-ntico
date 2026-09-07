import { CATEGORY_LABELS } from '@/data/categories';
import { getAllProducts } from './catalog';
import { normalize } from './format';
import type { Product } from '@/types';

interface Scored {
  product: Product;
  score: number;
}

/** Campos indexados y su peso. El nombre manda; la descripción apenas empuja. */
const WEIGHTS = {
  name: 10,
  tag: 6,
  collection: 4,
  category: 3,
  shortDescription: 2,
  description: 1,
} as const;

function scoreProduct(product: Product, terms: string[]): number {
  const name = normalize(product.name);
  const collection = normalize(product.collection);
  const category = normalize(CATEGORY_LABELS[product.category]);
  const short = normalize(product.shortDescription);
  const long = normalize(product.description);
  const tags = product.tags.map(normalize);

  let score = 0;

  for (const term of terms) {
    let matched = false;

    if (name.startsWith(term)) {
      score += WEIGHTS.name * 1.5;
      matched = true;
    } else if (name.includes(term)) {
      score += WEIGHTS.name;
      matched = true;
    }

    if (tags.some((tag) => tag.includes(term))) {
      score += WEIGHTS.tag;
      matched = true;
    }
    if (collection.includes(term)) {
      score += WEIGHTS.collection;
      matched = true;
    }
    if (category.includes(term)) {
      score += WEIGHTS.category;
      matched = true;
    }
    if (short.includes(term)) {
      score += WEIGHTS.shortDescription;
      matched = true;
    }
    if (long.includes(term)) {
      score += WEIGHTS.description;
      matched = true;
    }

    // Todos los términos deben aparecer en algún campo.
    if (!matched) return 0;
  }

  // Empate: gana lo más vendido.
  return score + product.salesCount / 10_000;
}

/**
 * Buscador por relevancia sobre el catálogo mock. Al conectar el backend,
 * esta función se reemplaza por `GET /api/products?q=` manteniendo la firma.
 */
export function searchProducts(term: string, products: Product[] = getAllProducts()): Product[] {
  const terms = normalize(term).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;

  return products
    .map<Scored>((product) => ({ product, score: scoreProduct(product, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}

/** Sugerencias rápidas para el modal de búsqueda. */
export const SEARCH_SUGGESTIONS = [
  'rosas',
  'flores eternas',
  'peonías',
  'girasoles',
  'regalo de cumpleaños',
  'velas',
] as const;
