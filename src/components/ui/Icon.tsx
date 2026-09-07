import {
  Award,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  Clock,
  CreditCard,
  Gift,
  Hand,
  Headset,
  House,
  Info,
  Landmark,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PenLine,
  Phone,
  Scissors,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Store,
  TriangleAlert,
  Truck,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type LucideLike = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Registro de iconos. Permite que los archivos de datos referencien un
 * icono por nombre (string) sin importar la librería, de forma que ese
 * mismo dato pueda llegar más adelante desde una API.
 */
const ICONS: Record<string, LucideLike> = {
  award: Award,
  'building-2': Building2,
  'calendar-days': CalendarDays,
  check: Check,
  'circle-check': CircleCheck,
  clock: Clock,
  'credit-card': CreditCard,
  gift: Gift,
  hand: Hand,
  headset: Headset,
  house: House,
  info: Info,
  landmark: Landmark,
  leaf: Leaf,
  lock: Lock,
  mail: Mail,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  package: Package,
  'pen-line': PenLine,
  phone: Phone,
  scissors: Scissors,
  search: Search,
  shield: ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  sprout: Sprout,
  store: Store,
  'triangle-alert': TriangleAlert,
  truck: Truck,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component aria-hidden="true" {...props} />;
}
