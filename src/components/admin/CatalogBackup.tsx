import { useRef, useState } from 'react';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { exportarCatalogo, importarCatalogo } from '@/lib/catalog-io';

/**
 * Copia de seguridad del catálogo.
 *
 * Los cambios del panel viven solo en este navegador: exportar es la forma de
 * sacarlos de aquí, ya sea para pasarlos a otro equipo o para que queden fijos
 * en el código, que es lo único que ve el público.
 */
export function CatalogBackup() {
  const products = useAdminProductsStore((state) => state.products);
  const replaceAll = useAdminProductsStore((state) => state.replaceAll);

  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sinPrecio = products.filter((p) => !p.price).length;

  const handleExportar = () => {
    exportarCatalogo(products);
    setAviso({
      tipo: 'ok',
      texto: `Se descargó el catálogo con ${products.length} productos.`,
    });
  };

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resultado = await importarCatalogo(file);
    if (inputRef.current) inputRef.current.value = '';

    if (!resultado.ok || !resultado.productos || !resultado.resumen) {
      setAviso({ tipo: 'error', texto: resultado.error ?? 'No se pudo leer el archivo.' });
      return;
    }

    const { total, activos, sinPrecio: sp, exportadoEl } = resultado.resumen;
    const fecha = exportadoEl.split('T')[0];

    // Importar pisa todo el catálogo: conviene que sea una decisión consciente.
    const confirmado = window.confirm(
      `El archivo tiene ${total} productos (${activos} publicados, ${sp} sin precio), ` +
        `exportado el ${fecha}.\n\n` +
        `Esto reemplaza los ${products.length} productos que tienes ahora en este navegador. ` +
        `¿Continuar?`,
    );
    if (!confirmado) return;

    replaceAll(resultado.productos);
    setAviso({ tipo: 'ok', texto: `Catálogo importado: ${total} productos.` });
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-serif text-xl font-semibold text-ink">Copia del catálogo</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Lo que editas aquí se guarda únicamente en este navegador: no lo ven tus clientes ni tus
        otros dispositivos, y se pierde si se limpian los datos del sitio. Exporta el catálogo para
        conservarlo o para que quede publicado de forma definitiva.
      </p>

      {sinPrecio > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Tienes {sinPrecio} producto(s) sin precio. Siguen ocultos en la tienda hasta que se lo
          asignes.
        </p>
      )}

      {aviso && (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-xs ${
            aviso.tipo === 'ok'
              ? 'bg-green-50 text-green-900'
              : 'bg-red-50 text-red-900'
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExportar}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-ivory transition-opacity hover:opacity-90"
        >
          ⬇ Exportar catálogo
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleArchivo}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-stone-50"
        >
          ⬆ Importar catálogo
        </button>
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        Se descarga un archivo <code className="rounded bg-stone-100 px-1">.json</code> con los{' '}
        {products.length} productos, sus precios, textos y fotos.
      </p>
    </div>
  );
}
