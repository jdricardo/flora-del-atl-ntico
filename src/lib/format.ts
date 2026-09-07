const numberFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

/** 198000 -> "$198.000" */
export function formatCOP(value: number): string {
  return `$${numberFormatter.format(Math.round(value))}`;
}

/** Porcentaje de descuento redondeado: (236000, 198000) -> 16 */
export function discountPercent(compareAtPrice: number, price: number): number {
  if (compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/** Recorta un texto en el último espacio antes del límite. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).trimEnd()}…`;
}

/** Quita tildes y pasa a minúsculas para comparaciones y búsquedas. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
