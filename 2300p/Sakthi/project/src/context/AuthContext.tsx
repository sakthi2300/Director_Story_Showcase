import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, role: 'director' | 'producer', password: string) => Promise<User>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        sessionStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  const login = async (email: string, role: 'director' | 'producer', password: string): Promise<User> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check if backend is available
      const isBackendAvailable = await checkBackendAvailability();
      if (!isBackendAvailable) {
        throw new Error('Backend server is not available. Please ensure the server is running at http://localhost:3001');
      }

      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, password }),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();

      // Ensure the user data includes the role and map _id to id
      const userData = {
        ...data,
        id: data._id,
        role: role // Ensure role is set correctly
      };

      // Store the user data in session storage
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return userData;
    } catch (error) {
      let errorMessage = 'An error occurred during login';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Login request timed out. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to the server. Please ensure the backend server is running at http://localhost:3000';
        } else {
          errorMessage = error.message;
        }
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  // Add a function to check backend availability
  const checkBackendAvailability = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  const register = async (userData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Map _id to id
      const registeredUser = {
        ...data,
        id: data._id,
      };

      // Store the user data in session storage
      sessionStorage.setItem('user', JSON.stringify(registeredUser));

      setAuthState({
        user: registeredUser,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}