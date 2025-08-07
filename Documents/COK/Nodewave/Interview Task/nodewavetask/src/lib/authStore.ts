import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: { id: string; email: string }) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user, isAuthenticated: true });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },
  initializeAuth: () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      // Dalam aplikasi nyata, Anda mungkin akan mendekode token atau memanggil endpoint /me
      // untuk mendapatkan detail pengguna dan memvalidasi token.
      // Untuk kesederhanaan, kita asumsikan token yang valid menyiratkan autentikasi di sini.
      set({ token, user: { id: "dummy-id", email: "user@example.com" }, isAuthenticated: true });
    }
  },
}));
