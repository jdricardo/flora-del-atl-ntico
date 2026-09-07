import { useNavigate } from 'react-router-dom';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { ProductForm } from '@/components/admin/ProductForm';
import type { AdminProduct } from '@/store/useAdminProductsStore';

export function ProductNewPage() {
  const navigate = useNavigate();
  const { addProduct } = useAdminProductsStore();

  const handleSubmit = (product: Omit<AdminProduct, 'sku'>) => {
    addProduct(product);
    navigate('/admin/productos');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Nuevo producto
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Completa la información para agregar un producto al catálogo
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
    </div>
  );
}
