/**
 * Utilidades de fecha en zona local. Las fechas de entrega viajan como
 * `yyyy-mm-dd` para evitar desfases de huso horario.
 */

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function today(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/** Después de las 2 p.m. la entrega del mismo día ya no alcanza a producirse. */
export function sameDayStillAvailable(now: Date = new Date()): boolean {
  return now.getHours() < 14;
}

/**
 * Primera fecha seleccionable. Si el producto y la ciudad permiten entrega
 * el mismo día y aún hay tiempo de producción, es hoy; si no, mañana.
 */
export function earliestDeliveryDate(sameDayEligible: boolean): string {
  const base = today();
  return toISODate(sameDayEligible && sameDayStillAvailable() ? base : addDays(base, 1));
}

/** Última fecha seleccionable: 90 días hacia adelante. */
export function latestDeliveryDate(): string {
  return toISODate(addDays(today(), 90));
}

const longFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const shortFormatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "2026-09-12" -> "Sábado, 12 de septiembre" */
export function formatLongDate(iso: string): string {
  return capitalize(longFormatter.format(fromISODate(iso)));
}

/** "2026-09-12" -> "12 sept" */
export function formatShortDate(iso: string): string {
  return shortFormatter.format(fromISODate(iso));
}

export function isValidISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(fromISODate(value).getTime());
}
