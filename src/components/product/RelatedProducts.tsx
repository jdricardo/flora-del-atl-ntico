import { getRelatedProducts } from '@/lib/catalog';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { Product } from '@/types';

export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-line bg-cream/40 py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="También te puede gustar"
          title="Productos similares"
          action={
            <ButtonLink to={`/tienda?categoria=${product.category}`} variant="secondary">
              Ver la categoría
            </ButtonLink>
          }
          className="mb-10 lg:mb-14"
        />
        <ProductGrid products={related} columns={4} />
      </Container>
    </section>
  );
}
