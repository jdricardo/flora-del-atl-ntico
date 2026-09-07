import { useNavigate, useParams } from 'react-router-dom';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { ProductForm } from '@/components/admin/ProductForm';
import type { AdminProduct } from '@/store/useAdminProductsStore';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, updateProduct } = useAdminProductsStore();

  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-ink-muted">Producto no encontrado</p>
        <button
          onClick={() => navigate('/admin/productos')}
          className="mt-4 text-sm font-medium text-ink hover:underline"
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  const handleSubmit = (updatedProduct: Omit<AdminProduct, 'sku'>) => {
    updateProduct(product.id, updatedProduct);
    navigate('/admin/productos');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Editar producto
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {product.name} · {product.sku}
        </p>
      </div>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
