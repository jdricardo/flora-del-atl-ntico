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
      /*
       * Un fallo aquí deja el cambio solo en memoria: la pantalla lo muestra
       * guardado y se pierde al recargar. Se avisa en pantalla porque nadie
       * trabaja con la consola abierta.
       */
      const lleno =
        error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.code === 22);

      console.error('Error guardando datos encriptados:', error);

      if (typeof window !== 'undefined') {
        window.alert(
          lleno
            ? 'No se pudo guardar: el almacenamiento del navegador está lleno. ' +
                'Suele pasar por fotos muy pesadas cargadas desde el panel. ' +
                'Elimina alguna y vuelve a intentarlo.'
            : 'No se pudo guardar el cambio. Recarga la página y vuelve a intentarlo.',
        );
      }
      throw error;
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};
