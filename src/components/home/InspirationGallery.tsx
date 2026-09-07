import { ArrowUpRight } from 'lucide-react';
import { INSPIRATION_POSTS } from '@/data/content';
import { SITE } from '@/data/site';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function InspirationGallery() {
  return (
    <section className="bg-cream/40 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Inspiración"
          title="@floramagdalena"
          description="Montajes, detrás de cámaras y colecciones nuevas."
          action={
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline relative inline-flex items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.14em] uppercase"
            >
              Seguir en Instagram
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          }
          className="mb-10 lg:mb-14"
        />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {INSPIRATION_POSTS.map((post) => (
            <li key={post.id}>
              <a
                href={post.href}
                className="group relative block overflow-hidden rounded-lg bg-cream"
                aria-label={post.caption}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 flex items-end bg-ink/45 p-3 opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-[0.68rem] leading-snug text-ivory">{post.caption}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
