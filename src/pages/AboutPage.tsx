import { img } from '@/data/images';
import { SITE } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';

const VALUES = [
  {
    icon: 'scissors',
    title: 'Nada se arma por adelantado',
    description:
      'Cada composición se monta el mismo día del despacho. Es más difícil de operar y es la única forma de que la flor llegue en su mejor momento.',
  },
  {
    icon: 'sprout',
    title: 'Compra directa al cultivo',
    description:
      'Trabajamos con fincas de la región del Atlántico y la Costa Caribe, y pagamos a 15 días. Sin intermediarios en el medio, la flor llega más fresca y el productor cobra mejor.',
  },
  {
    icon: 'award',
    title: 'Oficio antes que catálogo',
    description:
      'Nuestro equipo de diseño floral se formó en el taller. Preferimos una colección corta y bien resuelta a un catálogo infinito.',
  },
  {
    icon: 'house',
    title: 'Hecho en Colombia',
    description:
      'Cerámica de Ráquira, fique de Curití, cera de soya envasada en Barranquilla. Los objetos que acompañan la flor también tienen autor.',
  },
];

export function AboutPage() {
  useSeo({
    title: 'Nosotros · Distribuidora y Floristería',
    description:
      'Flora del Atlántico - Distribuidora y floristería con más de 20 años de experiencia en Malambo, Atlántico. Flores frescas y arreglos especiales para toda ocasión.',
    path: '/nosotros',
  });

  return (
    <>
      <Container className="pt-8 pb-16 lg:pt-10 lg:pb-24">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]} className="mb-8" />

        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Desde {SITE.founded} · Malambo, Atlántico</span>
            <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
              Más de 20 años
              <br />
              llevando flores a tu hogar
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-ink-muted">
              Flora del Atlántico es una distribuidora y floristería consolidada en Malambo con más de dos décadas de experiencia.
              Como distribuidores, garantizamos flores frescas de la más alta calidad, y como floristería,
              elaboramos cada arreglo a mano con dedicación para llevar alegría a Barranquilla, zona metropolitana y oriental del Atlántico.
            </p>
          </div>

          <div className="grain overflow-hidden rounded-2xl bg-cream">
            <img
              src={img('nosotros-taller')}
              alt="Taller de Flora del Atlántico en Malambo"
              width={1400}
              height={1000}
              loading="eager"
              decoding="async"
              className="aspect-4/3 w-full object-cover"
            />
          </div>
        </div>
      </Container>

      <section id="taller" className="scroll-mt-32 border-y border-line bg-cream/40 py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <div className="grain overflow-hidden rounded-2xl bg-cream">
                <img
                  src={img('nosotros-detalle')}
                  alt="Detalle de una composición en proceso de armado"
                  width={900}
                  height={1100}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/5 w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={100} className="flex flex-col justify-center gap-6">
              <span className="eyebrow">Nuestra floristería</span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem]">Cómo trabajamos</h2>
              <div className="flex max-w-xl flex-col gap-4 text-[0.95rem] leading-relaxed text-ink-muted">
                <p>
                  Desde temprano en la mañana recibimos las flores del día. Cada tallo se hidrata, revisa y clasifica
                  cuidadosamente para asegurar que solo trabajemos con las flores más frescas y en su mejor momento.
                </p>
                <p>
                  Cada arreglo se elabora completamente a mano, sin moldes. Nuestro equipo trabaja con dedicación
                  para crear composiciones únicas que reflejen la calidez y los colores del Caribe. Por eso ningún
                  arreglo es exactamente igual a otro.
                </p>
                <p>
                  Antes de enviar cada pedido, fotografiamos el arreglo para que puedas ver exactamente lo que
                  recibirá la persona especial. Esta es también nuestra garantía de calidad.
                </p>
              </div>
              <ButtonLink to="/tienda" variant="secondary" className="self-start">
                Ver la colección
              </ButtonLink>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="sostenibilidad" className="scroll-mt-32 py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Principios"
            title="En qué no negociamos"
            description="Cuatro decisiones que definen cómo operamos, incluso cuando encarecen la operación."
            align="center"
            className="mb-12 lg:mb-16"
          />

          <ul className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            {VALUES.map((value, index) => (
              <li key={value.title}>
                <Reveal delay={index * 80} className="flex gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-olive-500">
                    <Icon name={value.icon} className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{value.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink py-16 text-ivory lg:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl text-3xl sm:text-4xl">Visítanos en el atelier</h2>
          <p className="max-w-md text-sm leading-relaxed text-ivory/65">
            {SITE.atelier.street}, {SITE.atelier.neighborhood} · {SITE.atelier.city}
            <br />
            {SITE.atelier.hours}
          </p>
          <ButtonLink
            to="/contacto"
            className="border border-ivory/30 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
          >
            Cómo llegar y contacto
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
