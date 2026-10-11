import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SocialProvider } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }) => Promise<boolean>;
  socialLogin: (
    provider: SocialProvider,
    customProfile?: { email?: string; fullName?: string; role?: UserRole }
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('estate_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load current session from backend on startup
  useEffect(() => {
    const fetchSession = async () => {
      const savedToken = localStorage.getItem('estate_auth_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('estate_auth_token');
            setToken(null);
          }
        } else {
          localStorage.removeItem('estate_auth_token');
          setToken(null);
        }
      } catch (err) {
        console.warn('Could not verify session with backend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Listen for OAuth postMessage callbacks from popups
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { provider } = event.data;
        if (provider) {
          await socialLogin(provider);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('estate_auth_token', data.token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to register account.');
      }

      setUser(resData.user);
      setToken(resData.token);
      localStorage.setItem('estate_auth_token', resData.token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (
    provider: SocialProvider,
    customProfile?: { email?: string; fullName?: string; role?: UserRole }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Default email generation based on provider if not passed
      const email =
        customProfile?.email ||
        `patron.${provider}@the-digital-estate.rw`;
      const fullName =
        customProfile?.fullName ||
        (provider === 'google'
          ? 'Google Verified Patron'
          : provider === 'apple'
          ? 'Apple ID Investor'
          : provider === 'github'
          ? 'GitHub Architect'
          : 'Facebook VIP Member');

      const res = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email,
          fullName,
          role: customProfile?.role || 'buyer',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to authenticate with ${provider}`);
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('estate_auth_token', data.token);
      return true;
    } catch (err: any) {
      setError(err.message || 'Social login error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.warn('Logout API call failed:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('estate_auth_token');
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.message || 'Password reset link sent to your email.';
    } catch (e: any) {
      return 'Could not process request at this moment.';
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        socialLogin,
        logout,
        forgotPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
