import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AdminProduct } from '@/store/useAdminProductsStore';
import type { CategorySlug, ProductBadge } from '@/types';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { CATEGORIES } from '@/data/categories';
import {
  sanitizeProductId,
  sanitizeText,
  validatePrice,
  validateStock,
} from '@/lib/security';

interface ProductFormProps {
  product?: AdminProduct;
  onSubmit: (product: Omit<AdminProduct, 'sku'>) => void;
  submitLabel?: string;
}

export function ProductForm({ product, onSubmit, submitLabel = 'Guardar' }: ProductFormProps) {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category: product?.category || ('flores-frescas' as CategorySlug),
    collection: product?.collection || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    features: product?.features?.join('\n') || '',
    care: product?.care?.join('\n') || '',
    badges: product?.badges || ([] as ProductBadge[]),
    stock: product?.stock || 0,
    sameDayDelivery: product?.sameDayDelivery ?? true,
    rating: product?.rating || 4.5,
    reviewCount: product?.reviewCount || 0,
    tags: product?.tags?.join(', ') || '',
    images: product?.images || ['', '', ''],
    active: product?.active ?? true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const errors: Record<string, string> = {};

    // Validar ID
    const sanitizedId = sanitizeProductId(formData.id);
    if (!sanitizedId) {
      errors.id = 'ID inválido. Solo letras minúsculas, números y guiones.';
    }

    // Validar precio
    if (!validatePrice(formData.price)) {
      errors.price = 'Precio inválido. Debe ser mayor a 0.';
    }

    // Validar precio de comparación (si existe)
    if (formData.compareAtPrice && !validatePrice(formData.compareAtPrice)) {
      errors.compareAtPrice = 'Precio de comparación inválido.';
    }

    // Validar stock
    if (!validateStock(formData.stock)) {
      errors.stock = 'Stock inválido. Debe ser un número entero positivo.';
    }

    // Verificar si hay errores
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll al primer error
      const firstError = document.querySelector('[data-error]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Sanitizar textos
    const productData: Omit<AdminProduct, 'sku'> = {
      ...formData,
      id: sanitizedId!,
      name: sanitizeText(formData.name, 200),
      collection: sanitizeText(formData.collection, 100),
      shortDescription: sanitizeText(formData.shortDescription, 500),
      description: sanitizeText(formData.description, 2000),
      features: formData.features
        .split('\n')
        .map((f) => sanitizeText(f.trim(), 200))
        .filter(Boolean),
      care: formData.care
        .split('\n')
        .map((c) => sanitizeText(c.trim(), 200))
        .filter(Boolean),
      tags: formData.tags
        .split(',')
        .map((t) => sanitizeText(t.trim(), 50))
        .filter(Boolean),
      images: formData.images.filter(Boolean),
      createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
      salesCount: product?.salesCount || 0,
    };

    onSubmit(productData);
  };

  const handleBadgeToggle = (badge: ProductBadge) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información básica */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Información básica
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              ID del producto *
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="amor-eterno"
              disabled={!!product}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-ink focus:outline-none disabled:opacity-50 ${
                validationErrors.id ? 'border-red-500' : 'border-stone-200'
              }`}
              data-error={validationErrors.id ? 'true' : undefined}
              required
            />
            {validationErrors.id ? (
              <p className="mt-1 text-xs text-red-600">{validationErrors.id}</p>
            ) : (
              <p className="mt-1 text-xs text-ink-muted">Solo letras minúsculas, números y guiones</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Amor Eterno"
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as CategorySlug })
              }
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Colección *
            </label>
            <input
              type="text"
              value={formData.collection}
              onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
              placeholder="Amor y Amistad"
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Precios y stock */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Precios y stock
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Precio *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="185000"
              min="1"
              step="1000"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-ink focus:outline-none ${
                validationErrors.price ? 'border-red-500' : 'border-stone-200'
              }`}
              data-error={validationErrors.price ? 'true' : undefined}
              required
            />
            {validationErrors.price && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.price}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Precio comparación
            </label>
            <input
              type="number"
              value={formData.compareAtPrice || ''}
              onChange={(e) =>
                setFormData({ ...formData, compareAtPrice: Number(e.target.value) || 0 })
              }
              placeholder="220000"
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink-muted">Para mostrar descuento</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Stock disponible *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              min="0"
              step="1"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-ink focus:outline-none ${
                validationErrors.stock ? 'border-red-500' : 'border-stone-200'
              }`}
              data-error={validationErrors.stock ? 'true' : undefined}
              required
            />
            {validationErrors.stock && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.stock}</p>
            )}
          </div>
        </div>
      </div>

      {/* Descripciones */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Descripciones
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Descripción corta
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Rosas rojas en arreglo clásico del corazón"
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Descripción completa
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del producto..."
              rows={4}
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Características (una por línea)
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="24 a 28 rosas rojas frescas premium&#10;Altura aproximada: 45 cm&#10;Follaje verde decorativo"
              rows={4}
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-mono focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Badges y opciones */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Badges y opciones
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {(['nuevo', 'bestseller', 'edicion-limitada', 'premium'] as ProductBadge[]).map(
                (badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => handleBadgeToggle(badge)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      formData.badges.includes(badge)
                        ? 'bg-ink text-ivory'
                        : 'bg-stone-100 text-ink-muted hover:bg-stone-200'
                    }`}
                  >
                    {badge === 'nuevo' && 'Nuevo'}
                    {badge === 'bestseller' && 'Más vendido'}
                    {badge === 'edicion-limitada' && 'Edición limitada'}
                    {badge === 'premium' && 'Premium'}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sameDayDelivery"
              checked={formData.sameDayDelivery}
              onChange={(e) =>
                setFormData({ ...formData, sameDayDelivery: e.target.checked })
              }
              className="h-4 w-4 rounded border-stone-300 text-ink focus:ring-ink"
            />
            <label htmlFor="sameDayDelivery" className="text-sm font-medium text-ink">
              Entrega el mismo día disponible
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-stone-300 text-ink focus:ring-ink"
            />
            <label htmlFor="active" className="text-sm font-medium text-ink">
              Producto activo (visible en la tienda)
            </label>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Tags para búsqueda
        </h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Tags (separados por comas)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="rosas rojas, amor, romántico, amor y amistad"
            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-muted">Ayudan a que los clientes encuentren el producto</p>
        </div>
      </div>

      {/* Imágenes */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold text-ink">
          Imágenes del producto
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          Sube imágenes desde tu computadora o pega URLs. La primera es la imagen principal.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <ImageUpload
              key={index}
              label={`Imagen ${index + 1} ${index === 0 ? '⭐ Principal' : ''}`}
              value={formData.images[index] || ''}
              onChange={(imageUrl) => {
                const newImages = [...formData.images];
                newImages[index] = imageUrl;
                setFormData({ ...formData, images: newImages });
              }}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/admin/productos')}
        >
          Cancelar
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
