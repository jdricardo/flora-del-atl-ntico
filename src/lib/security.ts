/**
 * Utilidades de seguridad para el MVP
 * Implementa encriptación, hashing y sanitización
 */

import DOMPurify from 'dompurify';

// ============================================================================
// HASHING DE CONTRASEÑAS
// ============================================================================

/**
 * Genera hash SHA-256 de una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica contraseña contra hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// ============================================================================
// ENCRIPTACIÓN DE DATOS (AES-GCM)
// ============================================================================

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Deriva clave de encriptación desde la clave secreta
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encripta datos para localStorage
 */
export async function encryptData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generar IV aleatorio
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await getEncryptionKey();
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );

    // Combinar IV + datos encriptados
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convertir a base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Error encriptando datos:', error);
    throw new Error('Error de encriptación');
  }
}

/**
 * Desencripta datos desde localStorage
 */
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    // Convertir desde base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );

    // Extraer IV y datos
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const key = await getEncryptionKey();
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Error desencriptando datos:', error);
    throw new Error('Error de desencriptación');
  }
}

// ============================================================================
// SANITIZACIÓN DE INPUTS
// ============================================================================

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No permitir HTML
    ALLOWED_ATTR: [],
  });
}

/**
 * Valida y sanitiza ID de producto
 */
export function sanitizeProductId(id: string): string | null {
  const sanitized = id.trim().toLowerCase();

  // Solo letras minúsculas, números y guiones
  if (!/^[a-z0-9-]+$/.test(sanitized)) {
    return null;
  }

  // Longitud máxima
  if (sanitized.length > 100) {
    return null;
  }

  return sanitized;
}

/**
 * Valida precio
 */
export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && price < 100000000 && !isNaN(price);
}

/**
 * Valida stock
 */
export function validateStock(stock: number): boolean {
  return typeof stock === 'number' && stock >= 0 && Number.isInteger(stock) && !isNaN(stock);
}

/**
 * Sanitiza texto general (limita longitud y escapa)
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  return sanitizeHtml(text).slice(0, maxLength);
}

// ============================================================================
// VALIDACIÓN DE IMÁGENES
// ============================================================================

/**
 * Valida tamaño de archivo de imagen
 */
export function validateImageSize(file: File, maxSizeMB: number = 2): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Valida tipo de archivo de imagen
 */
export function validateImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * Valida archivo de imagen completo
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!validateImageType(file)) {
    return { valid: false, error: 'Tipo de archivo no válido. Usa JPG, PNG, WEBP o GIF.' };
  }

  if (!validateImageSize(file, 2)) {
    return { valid: false, error: 'La imagen es demasiado grande. Máximo 2MB.' };
  }

  return { valid: true };
}

// ============================================================================
// GESTIÓN DE SESIÓN
// ============================================================================

const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '30') * 60 * 1000; // minutos a ms

/**
 * Crea token de sesión con expiración
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TIMEOUT;
  const token = {
    id: crypto.randomUUID(),
    expiresAt,
    createdAt: Date.now(),
  };
  return btoa(JSON.stringify(token));
}

/**
 * Valida token de sesión
 */
export function validateSessionToken(token: string): boolean {
  try {
    const session = JSON.parse(atob(token));
    return session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

/**
 * Renueva token de sesión
 */
export function renewSessionToken(token: string): string | null {
  if (!validateSessionToken(token)) {
    return null;
  }
  return createSessionToken();
}

// ============================================================================
// RATE LIMITING
// ============================================================================

const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5');
const LOCKOUT_TIME = parseInt(import.meta.env.VITE_LOCKOUT_TIME || '15') * 60 * 1000; // minutos a ms

interface RateLimitData {
  attempts: number;
  lockedUntil: number | null;
}

/**
 * Obtiene datos de rate limiting
 */
function getRateLimitData(): RateLimitData {
  const data = localStorage.getItem('auth_rate_limit');
  if (!data) {
    return { attempts: 0, lockedUntil: null };
  }
  return JSON.parse(data);
}

/**
 * Guarda datos de rate limiting
 */
function setRateLimitData(data: RateLimitData): void {
  localStorage.setItem('auth_rate_limit', JSON.stringify(data));
}

/**
 * Verifica si el usuario está bloqueado
 */
export function isUserLocked(): { locked: boolean; timeLeft?: number } {
  const data = getRateLimitData();

  if (data.lockedUntil && data.lockedUntil > Date.now()) {
    const timeLeft = Math.ceil((data.lockedUntil - Date.now()) / 1000 / 60); // minutos
    return { locked: true, timeLeft };
  }

  // Limpiar bloqueo expirado
  if (data.lockedUntil && data.lockedUntil <= Date.now()) {
    setRateLimitData({ attempts: 0, lockedUntil: null });
  }

  return { locked: false };
}

/**
 * Registra intento fallido de login
 */
export function recordFailedAttempt(): { locked: boolean; attemptsLeft: number; lockoutTime?: number } {
  const data = getRateLimitData();
  data.attempts += 1;

  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_TIME;
    setRateLimitData(data);
    return {
      locked: true,
      attemptsLeft: 0,
      lockoutTime: Math.ceil(LOCKOUT_TIME / 1000 / 60),
    };
  }

  setRateLimitData(data);
  return {
    locked: false,
    attemptsLeft: MAX_ATTEMPTS - data.attempts,
  };
}

/**
 * Resetea contador de intentos (después de login exitoso)
 */
export function resetLoginAttempts(): void {
  setRateLimitData({ attempts: 0, lockedUntil: null });
}
