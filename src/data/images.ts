/**
 * Registro de imágenes.
 *
 * Las imágenes viven en `src/assets/images` y se resuelven en build (hash +
 * cache busting). Para reemplazar un placeholder por fotografía real basta
 * con dejar el archivo con el mismo nombre y añadir su extensión al glob.
 *
 * Cuando el catálogo venga de una API, `Product.images` recibirá URLs
 * absolutas y este módulo solo se usará para el contenido editorial.
 */
const files = import.meta.glob<string>('../assets/images/*.{svg,jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const registry = new Map<string, string>();

for (const [path, url] of Object.entries(files)) {
  const filename = path.split('/').pop();
  if (!filename) continue;
  registry.set(filename.replace(/\.[^.]+$/, ''), url);
}

const FALLBACK = registry.get('placeholder') ?? '';

/** Devuelve la URL de una imagen por su nombre de archivo (sin extensión). */
export function img(key: string): string {
  return registry.get(key) ?? FALLBACK;
}

/** Las tres tomas de un producto: principal + dos secundarias para la galería. */
export function productShots(id: string): string[] {
  return [img(`${id}-1`), img(`${id}-2`), img(`${id}-3`)];
}
