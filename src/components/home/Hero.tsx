import { Truck, Scissors, ShieldCheck } from 'lucide-react';
import { img } from '@/data/images';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const TRUST = [
  { icon: Truck, label: 'Entrega el mismo día' },
  { icon: Scissors, label: 'Armado a mano' },
  { icon: ShieldCheck, label: 'Compra segura' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Mancha de color muy tenue que da profundidad sin competir con la imagen. */}
      <div
        className="pointer-events-none absolute -top-40 -right-32 size-[38rem] rounded-full bg-rose-100/60 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="animate-fade-up flex flex-col items-start gap-7">
            <span className="eyebrow">Colección Atelier · Temporada 2026</span>

            <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
              Flores que
              <br />
              cuentan <em className="font-normal italic text-olive-600">historias</em>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              Composiciones diseñadas para convertir momentos especiales en recuerdos inolvidables.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink to="/tienda?categoria=flores-frescas" size="lg">
                Comprar flores
              </ButtonLink>
              <ButtonLink to="/tienda" variant="secondary" size="lg">
                Descubrir colección
              </ButtonLink>
            </div>

            <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
              {TRUST.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-[0.7rem] tracking-[0.1em] text-ink-muted uppercase">
                  <item.icon className="size-4 text-olive-500" aria-hidden="true" strokeWidth={1.6} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in relative">
            <div className="grain relative overflow-hidden rounded-2xl bg-cream">
              <img
                src={img('hero-principal')}
                alt="Composición floral de la colección Atelier sobre fondo crema"
                width={1800}
                height={1100}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-4/5 w-full object-cover sm:aspect-3/2 lg:aspect-4/5"
              />
            </div>

            <div className="animate-float absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-xl bg-ivory p-2 shadow-lift sm:block lg:-left-10 lg:w-48">
              <img
                src={img('hero-secundario')}
                alt="Detalle de rosas en tono empolvado"
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
                className="aspect-4/5 w-full rounded-lg object-cover"
              />
              <p className="px-1 pt-2 pb-1 text-[0.62rem] leading-snug tracking-[0.1em] text-ink-muted uppercase">
                Ramo Magdalena
                <br />
                nuestra firma
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
