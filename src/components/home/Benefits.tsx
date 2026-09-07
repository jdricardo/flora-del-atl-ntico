import { BENEFITS } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';

export function Benefits() {
  return (
    <section className="border-y border-line bg-ivory py-14 lg:py-18">
      <Container>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {BENEFITS.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal delay={index * 70} className="flex gap-4 lg:flex-col lg:gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-olive-500">
                  <Icon name={benefit.icon} className="size-4.5" strokeWidth={1.6} />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-sans text-[0.78rem] font-medium tracking-[0.1em] uppercase">{benefit.title}</h3>
                  <p className="text-[0.82rem] leading-relaxed text-ink-muted">{benefit.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
