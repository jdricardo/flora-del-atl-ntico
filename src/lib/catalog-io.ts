/**
 * Exportar e importar el catálogo como archivo.
 *
 * El panel guarda los cambios solo en este navegador. Exportar produce un
 * archivo con el catálogo completo que se puede llevar a otro equipo o pasar
 * a quien lo deje fijo en el código, que es lo único que publica de verdad.
 */

import type { AdminProduct } from '@/store/useAdminProductsStore';

/** Sube cuando cambie la forma del archivo, para poder rechazar los viejos. */
const FORMATO = 1;

interface ArchivoCatalogo {
  formato: number;
  exportadoEl: string;
  totalProductos: number;
  productos: AdminProduct[];
}

export function exportarCatalogo(productos: AdminProduct[]): void {
  const contenido: ArchivoCatalogo = {
    formato: FORMATO,
    exportadoEl: new Date().toISOString(),
    totalProductos: productos.length,
    productos,
  };

  const blob = new Blob([JSON.stringify(contenido, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  const fecha = new Date().toISOString().split('T')[0];
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `catalogo-flora-${fecha}.json`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  // Sin esto el blob queda retenido en memoria mientras dure la pestaña.
  URL.revokeObjectURL(url);
}

export interface ResultadoImportacion {
  ok: boolean;
  error?: string;
  productos?: AdminProduct[];
  resumen?: { total: number; activos: number; sinPrecio: number; exportadoEl: string };
}

/**
 * Valida el archivo antes de dejar que reemplace el catálogo: una importación
 * a ciegas puede dejar la tienda con productos rotos o a medias.
 */
export async function importarCatalogo(file: File): Promise<ResultadoImportacion> {
  let datos: unknown;

  try {
    datos = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }

  if (typeof datos !== 'object' || datos === null) {
    return { ok: false, error: 'El archivo no tiene el formato esperado.' };
  }

  const archivo = datos as Partial<ArchivoCatalogo>;

  if (archivo.formato !== FORMATO) {
    return {
      ok: false,
      error: `Formato de archivo no compatible (esperaba ${FORMATO}, llegó ${archivo.formato ?? 'ninguno'}).`,
    };
  }

  if (!Array.isArray(archivo.productos) || archivo.productos.length === 0) {
    return { ok: false, error: 'El archivo no contiene productos.' };
  }

  // Cada producto debe traer lo mínimo para que la tienda no reviente
  const invalidos: string[] = [];
  for (const [i, p] of archivo.productos.entries()) {
    const falta =
      typeof p?.id !== 'string' ||
      typeof p?.name !== 'string' ||
      typeof p?.price !== 'number' ||
      typeof p?.category !== 'string' ||
      !Array.isArray(p?.images);
    if (falta) invalidos.push(p?.id || `posición ${i + 1}`);
  }

  if (invalidos.length > 0) {
    return {
      ok: false,
      error: `${invalidos.length} producto(s) con datos incompletos: ${invalidos.slice(0, 3).join(', ')}${invalidos.length > 3 ? '…' : ''}`,
    };
  }

  const ids = archivo.productos.map((p) => p.id);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repetidos.length > 0) {
    return { ok: false, error: `Hay identificadores repetidos: ${[...new Set(repetidos)].join(', ')}` };
  }

  return {
    ok: true,
    productos: archivo.productos,
    resumen: {
      total: archivo.productos.length,
      activos: archivo.productos.filter((p) => p.active).length,
      sinPrecio: archivo.productos.filter((p) => !p.price).length,
      exportadoEl: archivo.exportadoEl ?? 'fecha desconocida',
    },
  };
}
