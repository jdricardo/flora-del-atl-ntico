import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  hashPassword,
  createSessionToken,
  validateSessionToken,
  renewSessionToken,
  isUserLocked,
  recordFailedAttempt,
  resetLoginAttempts,
} from '@/lib/security';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<LoginResult>;
  logout: () => void;
}

interface LoginResult {
  success: boolean;
  error?: string;
  attemptsLeft?: number;
  lockoutTime?: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hash de contraseña desde variables de entorno
const ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión válida con token
    const sessionToken = localStorage.getItem('admin_session_token');
    if (sessionToken && validateSessionToken(sessionToken)) {
      setIsAuthenticated(true);

      // Renovar token periódicamente
      const renewInterval = setInterval(() => {
        const currentToken = localStorage.getItem('admin_session_token');
        if (currentToken) {
          const newToken = renewSessionToken(currentToken);
          if (newToken) {
            localStorage.setItem('admin_session_token', newToken);
          } else {
            // Token expiró
            setIsAuthenticated(false);
            localStorage.removeItem('admin_session_token');
            clearInterval(renewInterval);
          }
        }
      }, 5 * 60 * 1000); // Renovar cada 5 minutos

      return () => clearInterval(renewInterval);
    } else {
      // Limpiar sesión inválida
      localStorage.removeItem('admin_session_token');
    }
  }, []);

  const login = async (password: string): Promise<LoginResult> => {
    // Verificar si el usuario está bloqueado
    const lockStatus = isUserLocked();
    if (lockStatus.locked) {
      return {
        success: false,
        error: `Demasiados intentos fallidos. Intenta de nuevo en ${lockStatus.timeLeft} minutos.`,
      };
    }

    // Verificar contraseña
    const passwordHash = await hashPassword(password);
    if (passwordHash === ADMIN_PASSWORD_HASH) {
      // Login exitoso
      setIsAuthenticated(true);
      const sessionToken = createSessionToken();
      localStorage.setItem('admin_session_token', sessionToken);
      resetLoginAttempts();
      return { success: true };
    }

    // Login fallido - registrar intento
    const attemptResult = recordFailedAttempt();
    if (attemptResult.locked) {
      return {
        success: false,
        error: `Demasiados intentos fallidos. Cuenta bloqueada por ${attemptResult.lockoutTime} minutos.`,
      };
    }

    return {
      success: false,
      error: 'Contraseña incorrecta',
      attemptsLeft: attemptResult.attemptsLeft,
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
