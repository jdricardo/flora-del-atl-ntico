import type { City } from '@/types';

/**
 * Cobertura de entrega. `preservedOnly` marca las ciudades donde solo
 * llegan flores preservadas, regalos y objetos (no flor fresca).
 */
export const CITIES: City[] = [
  // Zona Metropolitana de Barranquilla
  { id: 'malambo', name: 'Malambo', department: 'Atlántico', sameDay: true, shippingCost: 8_000, preservedOnly: false },
  { id: 'soledad', name: 'Soledad', department: 'Atlántico', sameDay: true, shippingCost: 10_000, preservedOnly: false },
  { id: 'barranquilla', name: 'Barranquilla', department: 'Atlántico', sameDay: true, shippingCost: 12_000, preservedOnly: false },
  { id: 'puerto-colombia', name: 'Puerto Colombia', department: 'Atlántico', sameDay: true, shippingCost: 15_000, preservedOnly: false },
  { id: 'galapa', name: 'Galapa', department: 'Atlántico', sameDay: true, shippingCost: 12_000, preservedOnly: false },
  // Oriental del Atlántico
  { id: 'sabanalarga', name: 'Sabanalarga', department: 'Atlántico', sameDay: true, shippingCost: 15_000, preservedOnly: false },
  { id: 'santo-tomas', name: 'Santo Tomás', department: 'Atlántico', sameDay: true, shippingCost: 18_000, preservedOnly: false },
  { id: 'palmar-varela', name: 'Palmar de Varela', department: 'Atlántico', sameDay: true, shippingCost: 18_000, preservedOnly: false },
  // Otras ciudades de la Costa Caribe
  { id: 'cartagena', name: 'Cartagena', department: 'Bolívar', sameDay: false, shippingCost: 25_000, preservedOnly: false },
  { id: 'santa-marta', name: 'Santa Marta', department: 'Magdalena', sameDay: false, shippingCost: 28_000, preservedOnly: false },
  { id: 'sincelejo', name: 'Sincelejo', department: 'Sucre', sameDay: false, shippingCost: 30_000, preservedOnly: false },
  { id: 'valledupar', name: 'Valledupar', department: 'Cesar', sameDay: false, shippingCost: 35_000, preservedOnly: false },
  { id: 'monteria', name: 'Montería', department: 'Córdoba', sameDay: false, shippingCost: 35_000, preservedOnly: false },
  { id: 'otras-ciudades', name: 'Otras ciudades del Caribe', department: 'Costa Caribe', sameDay: false, shippingCost: 40_000, preservedOnly: true },
];

export const DEFAULT_CITY_ID = 'malambo';

export function getCity(id: string | null | undefined): City | undefined {
  if (!id) return undefined;
  return CITIES.find((city) => city.id === id);
}

export function cityName(id: string | null | undefined): string {
  return getCity(id)?.name ?? 'Sin definir';
}
