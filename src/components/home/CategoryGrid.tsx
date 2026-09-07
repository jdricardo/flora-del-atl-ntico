import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { Category } from '@/types';

export function CategoryCard({ category, priority = false }: { category: Category; priority?: boolean }) {
  return (
    <Link
      to={`/tienda?categoria=${category.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-cream"
    >
      <div className="grain relative aspect-3/4 overflow-hidden">
        <img
          src={category.image}
          alt={`${category.name} — ${category.tagline}`}
          width={900}
          height={1200}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 text-ivory lg:p-6">
        <span className="text-[0.6rem] tracking-[0.16em] text-ivory/75 uppercase">{category.tagline}</span>
        <h3 className="font-serif text-2xl lg:text-[1.75rem]">{category.name}</h3>
        <span className="mt-1 inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.14em] uppercase">
          {category.cta}
          <ArrowRight
            className="size-3.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Explora"
          title="Cuatro formas de regalar"
          description="Cada categoría tiene su propio ritmo: la flor fresca para hoy, la eterna para siempre, el regalo para celebrar y el objeto para quedarse."
          className="mb-10 lg:mb-14"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category.slug} delay={index * 90}>
              <CategoryCard category={category} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
