import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { Button } from '@/components/ui/Button';
import { CATEGORY_LABELS } from '@/data/categories';
import { formatCOP } from '@/lib/format';

export function ProductsListPage() {
  const navigate = useNavigate();
  const { products, deleteProduct, duplicateProduct, toggleProductActive } = useAdminProductsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' || product.category === filterCategory;

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && product.active) ||
        (filterStatus === 'inactive' && !product.active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar el producto "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Productos
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>
        <Button onClick={() => navigate('/admin/productos/nuevo')}>
          + Nuevo producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar por nombre, ID o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-stone-200 px-4 py-2 text-sm focus:border-ink focus:outline-none"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm focus:border-ink focus:outline-none"
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm focus:border-ink focus:outline-none"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-stone-50 ${
                    !product.active ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg border border-stone-200 object-cover"
                      />
                      <div>
                        <p className="font-medium text-ink">{product.name}</p>
                        <p className="text-sm text-ink-muted">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-ink">
                    {formatCOP(product.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleProductActive(product.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {product.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/productos/${product.id}/editar`)}
                        className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-stone-50"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDuplicate(product.id)}
                        className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-stone-50"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-ink-muted">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
