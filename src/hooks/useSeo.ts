import { useEffect } from 'react';
import { SITE } from '@/data/site';

export interface SeoOptions {
  title: string;
  description?: string;
  /** Ruta canónica sin dominio, por ejemplo `/tienda`. */
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

/**
 * SEO por página: title, description, canonical y Open Graph.
 * Al migrar a SSR (Next.js o Remix) esta lógica se reemplaza por metadata
 * del framework sin tocar las páginas.
 */
export function useSeo({ title, description, path = '/', image, type = 'website', noindex = false }: SeoOptions): void {
  useEffect(() => {
    const fullTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`;
    const desc = description ?? SITE.description;
    const url = `${SITE.url}${path}`;
    const ogImage = image ? (image.startsWith('http') ? image : `${SITE.url}${image}`) : `${SITE.url}/og-image.svg`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', desc);
    upsertMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    upsertLink('canonical', url);
  }, [title, description, path, image, type, noindex]);
}
