import { Heart } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useWishlistProducts, useWishlistStore } from '@/store/useWishlistStore';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductGrid } from '@/components/product/ProductGrid';

export function WishlistPage() {
  const products = useWishlistProducts();
  const clear = useWishlistStore((state) => state.clear);
  const addToCart = useAddToCart();

  useSeo({
    title: 'Mis favoritos',
    description: 'Los productos que guardaste para después.',
    path: '/favoritos',
    noindex: true,
  });

  const addAll = () => {
    for (const product of products) {
      if (product.stock > 0) addToCart(product);
    }
  };

  return (
    <Container className="pt-8 pb-24 lg:pt-10">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mis favoritos' }]} className="mb-8" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-xl flex-col gap-4">
          <span className="eyebrow">Guardados</span>
          <h1 className="flex items-center gap-3 text-4xl sm:text-5xl">
            Mis favoritos
            <Heart className="size-6 fill-rose-400 text-rose-400" aria-hidden="true" />
          </h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted">
            {products.length > 0
              ? 'Se guardan en este navegador. Cuando exista sistema de usuarios, viajarán con tu cuenta.'
              : 'Toca el corazón en cualquier producto para guardarlo aquí.'}
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={addAll}>
              Agregar todo al carrito
            </Button>
            <Button variant="ghost" onClick={clear}>
              Vaciar
            </Button>
          </div>
        )}
      </div>

      <div className="mt-12">
        <ProductGrid
          products={products}
          columns={4}
          emptyState={
            <EmptyState
              icon="sparkles"
              title="Todavía no has guardado nada"
              description="Explora la colección y guarda lo que quieras enviar más adelante."
              action={<ButtonLink to="/tienda">Ver la colección</ButtonLink>}
            />
          }
        />
      </div>
    </Container>
  );
}
