import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';

export function DashboardPage() {
  const stats = [
    {
      label: 'Total de productos',
      value: PRODUCTS.length,
      link: '/admin/productos',
      linkText: 'Ver todos',
    },
    {
      label: 'Categorías',
      value: CATEGORIES.length,
      link: '/admin/productos',
      linkText: 'Gestionar',
    },
    {
      label: 'Stock total',
      value: PRODUCTS.reduce((sum, p) => sum + p.stock, 0),
      link: '/admin/productos',
      linkText: 'Revisar',
    },
    {
      label: 'Productos activos',
      value: PRODUCTS.length,
      link: '/admin/productos',
      linkText: 'Ver',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Dashboard
        </h1>
        <p className="mt-2 text-ink-muted">
          Bienvenido al panel de administración de Flora del Atlántico
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-6"
          >
            <p className="text-sm text-ink-muted">{stat.label}</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-ink">
              {stat.value}
            </p>
            <Link
              to={stat.link}
              className="mt-4 inline-block text-sm font-medium text-ink hover:underline"
            >
              {stat.linkText} →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-serif text-xl font-semibold text-ink">
          Acciones rápidas
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/productos/nuevo"
            className="flex items-center gap-3 rounded-lg border border-stone-200 p-4 transition-colors hover:border-ink hover:bg-stone-50"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-ink">Nuevo producto</p>
              <p className="text-sm text-ink-muted">Agregar al catálogo</p>
            </div>
          </Link>
          <Link
            to="/admin/productos"
            className="flex items-center gap-3 rounded-lg border border-stone-200 p-4 transition-colors hover:border-ink hover:bg-stone-50"
          >
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-medium text-ink">Ver productos</p>
              <p className="text-sm text-ink-muted">Gestionar catálogo</p>
            </div>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg border border-stone-200 p-4 transition-colors hover:border-ink hover:bg-stone-50"
          >
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-medium text-ink">Ver tienda</p>
              <p className="text-sm text-ink-muted">Sitio público</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
