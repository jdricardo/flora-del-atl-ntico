import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import './index.css';

/**
 * El build de demo estática (`npm run build:preview`) usa rutas con hash
 * porque no hay servidor que reescriba las URLs. En desarrollo y en
 * producción se usa BrowserRouter con URLs limpias.
 */
const Router = import.meta.env.VITE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root.');

createRoot(container).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
