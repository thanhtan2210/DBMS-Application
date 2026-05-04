import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

/**
 * DBMS MONOLITH - AUTH STORE (Zustand)
 * Manages JWT tokens and user session state.
 */

interface DecodedToken {
  sub: string;        // Email
  role: string;       // CUSTOMER | ADMIN | STAFF
  exp: number;        // Expiration timestamp
}

interface UserInfo {
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  
  // Actions
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: async (token: string) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const user: UserInfo = {
            email: decoded.sub,
            role: decoded.role ? decoded.role.replace('ROLE_', '') : 'CUSTOMER',
          };

          set({ 
            token, 
            user, 
            isAuthenticated: true 
          });
          
          localStorage.setItem('access_token', token);
        } catch (error) {
          console.error('Invalid token received:', error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('access_token');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
