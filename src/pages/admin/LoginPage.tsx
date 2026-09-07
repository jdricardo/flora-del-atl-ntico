import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(password);
    if (result.success) {
      navigate('/admin');
    } else {
      let errorMessage = result.error || 'Error al iniciar sesión';
      if (result.attemptsLeft !== undefined && result.attemptsLeft > 0) {
        errorMessage += ` (${result.attemptsLeft} intentos restantes)`;
      }
      setError(errorMessage);
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-semibold text-ink">
              Flora Admin
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                autoFocus
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
                required
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>

            <p className="text-center text-xs text-ink-muted">
              Contraseña demo: <code className="rounded bg-stone-100 px-1">admin123</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
