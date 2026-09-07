import { useMemo } from 'react';
import { getFeaturedProducts } from '@/lib/catalog';
import { useDeferredCatalog } from '@/hooks/useDeferredCatalog';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';

export function FeaturedProducts() {
  const featured = useMemo(() => getFeaturedProducts(8), []);
  const { data, isLoading } = useDeferredCatalog(featured, 500);

  return (
    <section className="bg-cream/40 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Los más pedidos"
          title="Productos destacados"
          description="Lo que más sale del taller esta temporada, listo para enviar hoy."
          action={
            <ButtonLink to="/tienda" variant="secondary">
              Ver toda la colección
            </ButtonLink>
          }
          className="mb-10 lg:mb-14"
        />

        <ProductGrid products={data} isLoading={isLoading} columns={4} skeletonCount={8} />
      </Container>
    </section>
  );
}
