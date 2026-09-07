import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmedPage } from '@/pages/OrderConfirmedPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProductsListPage } from '@/pages/admin/ProductsListPage';
import { ProductNewPage } from '@/pages/admin/ProductNewPage';
import { ProductEditPage } from '@/pages/admin/ProductEditPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/favoritos" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-confirmado" element={<OrderConfirmedPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="productos" element={<ProductsListPage />} />
        <Route path="productos/nuevo" element={<ProductNewPage />} />
        <Route path="productos/:id/editar" element={<ProductEditPage />} />
      </Route>
    </Routes>
  );
}
