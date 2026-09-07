import { PROCESS_STEPS } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function HowItWorks() {
  return (
    <section className="bg-ink py-16 text-ivory lg:py-24">
      <Container>
        <div className="flex flex-col gap-4 text-center">
          <span className="eyebrow text-ivory/55">Cómo funciona</span>
          <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl lg:text-[2.75rem]">
            Cuatro pasos entre tu idea y su sonrisa
          </h2>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 90} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-3xl text-gold-soft">{step.step}</span>
                  <span className="h-px flex-1 bg-ivory/15" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ivory/65">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <ButtonLink
            to="/tienda"
            className="border border-ivory/30 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
          >
            Empezar mi pedido
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
