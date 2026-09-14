import type { City } from '@/types';

/**
 * Cobertura de entrega: únicamente el departamento del Atlántico.
 *
 * La tarifa no crece con la distancia en línea recta: la floristería está en
 * Malambo, así que los municipios del oriente salen más baratos que
 * Barranquilla o Puerto Colombia.
 */
export const CITIES: City[] = [
  { id: 'malambo', name: 'Malambo', department: 'Atlántico', sameDay: true, shippingCost: 5_000 },
  { id: 'soledad', name: 'Soledad', department: 'Atlántico', sameDay: true, shippingCost: 15_000 },
  { id: 'barranquilla', name: 'Barranquilla', department: 'Atlántico', sameDay: true, shippingCost: 20_000 },
  { id: 'puerto-colombia', name: 'Puerto Colombia', department: 'Atlántico', sameDay: true, shippingCost: 30_000 },
  // Resto del departamento, tarifa única
  { id: 'galapa', name: 'Galapa', department: 'Atlántico', sameDay: true, shippingCost: 10_000 },
  { id: 'sabanalarga', name: 'Sabanalarga', department: 'Atlántico', sameDay: true, shippingCost: 10_000 },
  { id: 'santo-tomas', name: 'Santo Tomás', department: 'Atlántico', sameDay: true, shippingCost: 10_000 },
  { id: 'palmar-varela', name: 'Palmar de Varela', department: 'Atlántico', sameDay: true, shippingCost: 10_000 },
  { id: 'resto-atlantico', name: 'Resto del Atlántico', department: 'Atlántico', sameDay: true, shippingCost: 10_000 },
];

export const DEFAULT_CITY_ID = 'malambo';

export function getCity(id: string | null | undefined): City | undefined {
  if (!id) return undefined;
  return CITIES.find((city) => city.id === id);
}

export function cityName(id: string | null | undefined): string {
  return getCity(id)?.name ?? 'Sin definir';
}
