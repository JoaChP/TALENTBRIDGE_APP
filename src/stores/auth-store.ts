import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AuthState, User } from "../types"
import { mockApi } from "../mocks/api"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        console.log("[AuthStore] Login attempt for:", email)
        const { user, token } = await mockApi.login(email, password)
        console.log("[AuthStore] Login successful, setting user:", user)
        set({ user, token })
      },
      register: async (name: string, email: string, password: string, role) => {
        const { user, token } = await mockApi.register(name, email, password, role)
        set({ user, token })
      },
      logout: () => {
        console.log("[AuthStore] Logging out")
        mockApi.logout()
        set({ user: null, token: null })
      },
      updateProfile: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
      refreshUser: async () => {
        const currentUser = get().user
        if (!currentUser) return
        
        try {
          // Verificar si el usuario todavía existe
          const users = await mockApi.listUsers()
          const updatedUser = users.find(u => u.id === currentUser.id)
          
          if (updatedUser) {
            // Usuario existe, actualizar con los datos más recientes
            console.log("[AuthStore] User refreshed:", updatedUser)
            set({ user: updatedUser })
          } else {
            // Usuario fue eliminado, cerrar sesión
            console.log("[AuthStore] User was deleted, logging out")
            mockApi.logout()
            set({ user: null, token: null })
            
            // Redirigir al login
            if (typeof window !== "undefined") {
              window.location.href = "/login"
            }
          }
        } catch (error) {
          console.error("[AuthStore] Error refreshing user:", error)
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[AuthStore] Rehydration error:", error)
        } else {
          console.log("[AuthStore] Rehydrated with state:", state)
        }
      },
    },
  ),
)
