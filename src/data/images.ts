/**
 * Registro de imágenes.
 *
 * Las imágenes viven en `src/assets/images` y se resuelven en build (hash +
 * cache busting). Las fotos del catálogo impreso están en el subdirectorio
 * `catalogo/`, una por referencia (c01.jpg, b03.jpg, r17.jpg...).
 *
 * Cuando el catálogo venga de una API, `Product.images` recibirá URLs
 * absolutas y este módulo solo se usará para el contenido editorial.
 */
const files = import.meta.glob<string>('../assets/images/**/*.{svg,jpg,jpeg,png,webp,avif}', {
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

/**
 * Fotos de un producto para la galería.
 *
 * El catálogo impreso trae una sola toma por referencia, así que se devuelve
 * esa; el esquema `id-1 / id-2 / id-3` sigue soportado para los productos que
 * lleguen con varias fotos.
 */
export function productShots(id: string): string[] {
  const single = registry.get(id);
  if (single) return [single];

  const numbered = [1, 2, 3]
    .map((n) => registry.get(`${id}-${n}`))
    .filter((url): url is string => Boolean(url));

  return numbered.length > 0 ? numbered : [FALLBACK];
}
