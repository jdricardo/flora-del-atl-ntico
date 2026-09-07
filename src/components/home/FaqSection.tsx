import { FAQ_ITEMS } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { whatsappLink } from '@/data/site';

interface FaqSectionProps {
  /** Limita el número de preguntas (la home muestra menos que /contacto). */
  limit?: number;
  className?: string;
}

export function FaqSection({ limit, className }: FaqSectionProps) {
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section id="faq" className={className ?? 'py-16 lg:py-24'}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem]">Antes de comprar</h2>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
              Si te queda alguna duda, escríbenos por WhatsApp: respondemos en horario del taller, de lunes a sábado.
            </p>
            <ButtonLink href={whatsappLink()} variant="secondary" className="self-start">
              Hablar con el taller
            </ButtonLink>
          </div>

          <Accordion items={items} defaultOpen={items[0]?.id} />
        </div>
      </Container>
    </section>
  );
}
