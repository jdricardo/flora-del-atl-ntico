import { TESTIMONIALS } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Rating } from '@/components/ui/Rating';
import type { Testimonial } from '@/types';

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full min-w-[19rem] snap-start flex-col gap-4 rounded-xl border border-line bg-ivory p-6 sm:min-w-0">
      <Rating value={testimonial.rating} />
      <blockquote className="flex-1 font-serif text-lg leading-snug text-ink sm:text-xl">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="flex flex-col gap-0.5 border-t border-line pt-4">
        <span className="text-sm font-medium">{testimonial.name}</span>
        <span className="text-[0.68rem] tracking-[0.1em] text-ink-muted uppercase">
          {testimonial.city} · {testimonial.occasion}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Opiniones"
          title="Lo que dicen quienes ya enviaron"
          description="Reseñas de demostración, escritas para ilustrar el diseño de la sección."
          align="center"
          className="mb-10 lg:mb-14"
        />

        {/* Carrusel con scroll-snap en móvil, grid en desktop. */}
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.id} className="flex">
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
