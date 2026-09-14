import { CITIES } from '@/data/cities';
import { DELIVERY_SLOTS, PAYMENT_METHODS } from '@/data/site';
import { earliestDeliveryDate, isValidISODate } from './dates';
import type { PaymentMethodId } from '@/types';

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cityId: string;
  line1: string;
  complement: string;
  neighborhood: string;
  deliveryDate: string;
  slotId: string;
  dedication: string;
  paymentMethod: PaymentMethodId;
  acceptTerms: boolean;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export const CHECKOUT_STEPS = [
  { id: 'cliente', title: 'Información del cliente', fields: ['firstName', 'lastName', 'email', 'phone'] },
  { id: 'direccion', title: 'Dirección de entrega', fields: ['cityId', 'line1', 'complement', 'neighborhood'] },
  { id: 'entrega', title: 'Fecha y franja', fields: ['deliveryDate', 'slotId'] },
  { id: 'dedicatoria', title: 'Dedicatoria', fields: ['dedication'] },
  { id: 'pago', title: 'Pago', fields: ['paymentMethod', 'acceptTerms'] },
] as const satisfies ReadonlyArray<{ id: string; title: string; fields: ReadonlyArray<keyof CheckoutFormValues> }>;

export const MAX_DEDICATION_LENGTH = 240;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const onlyDigits = (value: string): string => value.replace(/\D/g, '');

/** Formatea un celular colombiano mientras se escribe: 300 000 0000 */
export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean).join(' ');
}

export function createEmptyCheckoutValues(overrides: Partial<CheckoutFormValues> = {}): CheckoutFormValues {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cityId: '',
    line1: '',
    complement: '',
    neighborhood: '',
    deliveryDate: '',
    slotId: DELIVERY_SLOTS[0]?.id ?? '',
    dedication: '',
    paymentMethod: 'transferencia',
    acceptTerms: false,
    ...overrides,
  };
}

/**
 * Validación del checkout. Devuelve un mapa campo -> mensaje; vacío significa
 * que el formulario puede enviarse.
 */
export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.firstName.trim().length < 2) errors.firstName = 'Escribe tu nombre.';
  if (values.lastName.trim().length < 2) errors.lastName = 'Escribe tu apellido.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Revisa el correo, parece incompleto.';

  const phone = onlyDigits(values.phone);
  if (phone.length !== 10 || !phone.startsWith('3')) {
    errors.phone = 'Ingresa un celular de 10 dígitos que empiece por 3.';
  }

  if (!CITIES.some((city) => city.id === values.cityId)) errors.cityId = 'Elige la ciudad de entrega.';
  if (values.line1.trim().length < 6) errors.line1 = 'Ingresa la dirección completa.';
  if (values.neighborhood.trim().length < 3) errors.neighborhood = 'Ingresa el barrio.';

  if (!isValidISODate(values.deliveryDate)) {
    errors.deliveryDate = 'Elige la fecha de entrega.';
  } else if (values.deliveryDate < earliestDeliveryDate(true)) {
    errors.deliveryDate = 'Esa fecha ya pasó. Elige una posterior.';
  }

  if (!DELIVERY_SLOTS.some((slot) => slot.id === values.slotId)) errors.slotId = 'Elige una franja horaria.';

  if (values.dedication.length > MAX_DEDICATION_LENGTH) {
    errors.dedication = `Máximo ${MAX_DEDICATION_LENGTH} caracteres.`;
  }

  if (!PAYMENT_METHODS.some((method) => method.id === values.paymentMethod)) {
    errors.paymentMethod = 'Elige cómo prefieres pagar.';
  }

  if (!values.acceptTerms) errors.acceptTerms = 'Debes aceptar los términos para continuar.';

  return errors;
}

/** Primer paso que contiene un error, para hacer scroll hasta él. */
export function firstStepWithError(errors: CheckoutErrors): string | null {
  for (const step of CHECKOUT_STEPS) {
    if (step.fields.some((field) => errors[field])) return step.id;
  }
  return null;
}
