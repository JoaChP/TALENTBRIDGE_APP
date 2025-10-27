import { create } from "zustand"
import type { AuthState, User } from "../types"
import { mockApi } from "../mocks/api"

export const useAuthStore = create<AuthState>((set, get) => {
  // Restore session on init
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("auth-storage")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.state?.user && parsed.state?.token) {
          set({ user: parsed.state.user, token: parsed.state.token })
        }
      } catch (error) {
        console.error("[AuthStore] Error restoring session:", error)
      }
    }
  }

  return {
    user: null,
    token: null,
    login: async (email: string, password: string) => {
      console.log("[AuthStore] Login attempt for:", email)
      const { user, token } = await mockApi.login(email, password)
      console.log("[AuthStore] Login successful, setting user:", user)
      set({ user, token })
      
      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth-storage", JSON.stringify({ state: { user, token } }))
      }
    },
    register: async (name: string, email: string, password: string, role, phone?: string) => {
      const { user, token } = await mockApi.register(name, email, password, role, phone)
      set({ user, token })
      
      // Save to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("auth-storage", JSON.stringify({ state: { user, token } }))
      }
    },
    logout: () => {
      console.log("[AuthStore] Logging out")
      mockApi.logout()
      set({ user: null, token: null })
      
      // Clear sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth-storage")
      }
    },
    updateProfile: (updates: Partial<User>) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }))
      
      // Update sessionStorage
      const updatedUser = get().user
      if (typeof window !== "undefined" && updatedUser) {
        sessionStorage.setItem("auth-storage", JSON.stringify({ 
          state: { user: updatedUser, token: get().token } 
        }))
      }
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
          
          // Update sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("auth-storage", JSON.stringify({ 
              state: { user: updatedUser, token: get().token } 
            }))
          }
        } else {
          // Usuario fue eliminado, cerrar sesión
          console.log("[AuthStore] User was deleted, logging out")
          mockApi.logout()
          set({ user: null, token: null })
          
          // Clear sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("auth-storage")
          }
          
          // Redirigir al login
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }
      } catch (error) {
        console.error("[AuthStore] Error refreshing user:", error)
      }
    },
  }
})
