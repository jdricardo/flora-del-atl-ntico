import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { secureStorage } from '@/lib/secure-storage';

export interface AdminProduct extends Product {
  active: boolean;
  createdBy?: string;
  updatedAt?: string;
}

interface AdminProductsState {
  products: AdminProduct[];

  // CRUD operations
  addProduct: (product: Omit<AdminProduct, 'sku'>) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Activar/Desactivar
  toggleProductActive: (id: string) => void;

  // Actualizar imágenes
  updateProductImages: (id: string, images: string[]) => void;

  // Obtener productos
  getProduct: (id: string) => AdminProduct | undefined;
  getActiveProducts: () => AdminProduct[];

  // Reset
  resetToDefaults: () => void;
}

// Convertir productos iniciales a AdminProduct
const initialAdminProducts: AdminProduct[] = INITIAL_PRODUCTS.map((product) => ({
  ...product,
  active: true,
  updatedAt: new Date().toISOString(),
}));

export const useAdminProductsStore = create<AdminProductsState>()(
  persist(
    (set, get) => ({
      products: initialAdminProducts,

      addProduct: (product) => {
        const allProducts = get().products;
        const sku = `FM-${String(allProducts.length + 1).padStart(3, '0')}`;

        const newProduct: AdminProduct = {
          ...product,
          sku,
          active: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
        };

        set({ products: [...allProducts, newProduct] });
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      duplicateProduct: (id) => {
        const product = get().getProduct(id);
        if (!product) return;

        const allProducts = get().products;
        const sku = `FM-${String(allProducts.length + 1).padStart(3, '0')}`;

        const duplicated: AdminProduct = {
          ...product,
          id: `${product.id}-copy-${Date.now()}`,
          sku,
          name: `${product.name} (Copia)`,
          stock: 0,
          salesCount: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
        };

        set({ products: [...allProducts, duplicated] });
      },

      toggleProductActive: (id) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  active: !product.active,
                  updatedAt: new Date().toISOString()
                }
              : product
          ),
        }));
      },

      updateProductImages: (id, images) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, images, updatedAt: new Date().toISOString() }
              : product
          ),
        }));
      },

      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },

      getActiveProducts: () => {
        return get().products.filter((product) => product.active);
      },

      resetToDefaults: () => {
        set({ products: initialAdminProducts });
      },
    }),
    {
      name: 'admin-products-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
