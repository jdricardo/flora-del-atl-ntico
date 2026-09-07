import { useSeo } from '@/hooks/useSeo';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { img } from '@/data/images';

export function NotFoundPage() {
  useSeo({ title: 'Página no encontrada', path: '/404', noindex: true });

  return (
    <Container className="py-20 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-start gap-6">
          <span className="eyebrow">Error 404</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">Esta página se marchitó</h1>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
            El enlace que seguiste ya no existe o cambió de lugar. Puedes volver al inicio o explorar la colección
            completa.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/">Volver al inicio</ButtonLink>
            <ButtonLink to="/tienda" variant="secondary">
              Ver la tienda
            </ButtonLink>
          </div>
        </div>

        <div className="grain overflow-hidden rounded-2xl bg-cream">
          <img
            src={img('hero-secundario')}
            alt=""
            width={900}
            height={1200}
            className="aspect-4/3 w-full object-cover lg:aspect-4/5"
          />
        </div>
      </div>
    </Container>
  );
}
