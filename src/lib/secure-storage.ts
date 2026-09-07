/**
 * Wrapper para localStorage con encriptación automática
 * Compatible con persist middleware de Zustand
 */

import { encryptData, decryptData } from './security';
import type { StateStorage } from 'zustand/middleware';

export const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const encryptedValue = localStorage.getItem(name);
      if (!encryptedValue) {
        return null;
      }

      // Si no está encriptado (datos legacy), devolverlo tal cual
      // Esto permite migración gradual
      if (!encryptedValue.startsWith('enc:')) {
        return encryptedValue;
      }

      const encrypted = encryptedValue.slice(4); // Quitar prefijo 'enc:'
      const decrypted = await decryptData(encrypted);
      return decrypted;
    } catch (error) {
      console.error('Error leyendo datos encriptados:', error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const encrypted = await encryptData(value);
      localStorage.setItem(name, 'enc:' + encrypted); // Prefijo para identificar datos encriptados
    } catch (error) {
      console.error('Error guardando datos encriptados:', error);
      throw error;
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};
