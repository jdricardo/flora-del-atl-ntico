import { img } from '@/data/images';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/** Bloque editorial tipo revista: imagen grande, texto corto y una cifra. */
export function EditorialSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="flex flex-col items-start gap-6">
              <span className="eyebrow">Diario del taller</span>
              <h2 className="text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]">El arte de regalar</h2>
              <div className="flex max-w-lg flex-col gap-4 text-[0.95rem] leading-relaxed text-ink-muted">
                <p>
                  Un buen regalo no es el más grande ni el más costoso: es el que demuestra que alguien estuvo
                  pensando. Por eso trabajamos con encargos pequeños y armamos cada composición el mismo día, con la
                  flor que llegó esa mañana del cultivo.
                </p>
                <p>
                  Nuestras diseñadoras parten de una pregunta simple —¿qué quieres que sienta al abrirlo?— y desde
                  ahí eligen paleta, textura y formato. El resultado nunca es exactamente igual dos veces, y eso es
                  intencional.
                </p>
              </div>

              <dl className="grid w-full max-w-md grid-cols-3 gap-4 border-y border-line py-6">
                {[
                  { value: '8 años', label: 'diseñando en Barranquilla' },
                  { value: '32.000+', label: 'entregas realizadas' },
                  { value: '6 h', label: 'promedio de entrega' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <dt className="font-serif text-2xl lg:text-3xl">{stat.value}</dt>
                    <dd className="text-[0.68rem] leading-snug tracking-[0.08em] text-ink-muted uppercase">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <ButtonLink to="/nosotros" variant="secondary">
                Conocer el taller
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={120}>
            <div className="relative">
              <div className="grain overflow-hidden rounded-2xl bg-cream">
                <img
                  src={img('editorial-arte-de-regalar')}
                  alt="Mesa de trabajo del taller con flores en tonos arcilla"
                  width={1400}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="aspect-4/5 w-full object-cover lg:aspect-3/4"
                />
              </div>
              <figure className="absolute -right-3 bottom-6 hidden max-w-56 rounded-xl bg-ivory p-4 shadow-lift lg:block">
                <blockquote className="font-serif text-lg leading-snug italic">
                  “La flor manda. Nosotros solo la ordenamos.”
                </blockquote>
                <figcaption className="mt-2 text-[0.62rem] tracking-[0.12em] text-ink-muted uppercase">
                  Mariana Ávila · directora creativa
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
