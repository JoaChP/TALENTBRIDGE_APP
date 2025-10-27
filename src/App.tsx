"use client"

import { useEffect, useState, useMemo } from "react"
import { AppShell } from "./components/layout/app-shell"
import { HomePage } from "./pages-legacy/home"
import { SearchPage } from "./pages-legacy/search"
import { PublishPage } from "./pages-legacy/publish"
import { ProfilePage } from "./pages-legacy/profile"
import { PracticeDetailPage } from "./pages-legacy/practice-detail"
import { RegisterPage } from "./pages-legacy/register"
import { UnauthorizedPage } from "./pages-legacy/unauthorized"
import StudentDashboard from "./components/student-dashboard-client"
import { CompanyDashboard } from "./pages-legacy/dashboard/company"
import AdminDashboard from "./pages-legacy/dashboard/admin"
import MessagesPage from "./pages-legacy/messages"
import MessageDetailPage from "./pages-legacy/message-detail"
import ApplicationsPage from "./pages-legacy/applications"
import CompanyApplicationsPage from "./pages-legacy/company-applications"
import { useAuthStore } from "./stores/auth-store"
import { UserProfilePage } from "./pages-legacy/user-profile"
import { PerformanceMonitor } from "./utils/performance"

export default function App() {
  const user = useAuthStore((state) => state.user)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    PerformanceMonitor.start('app-init')
    
    // Get current path
    const path = window.location.pathname
    setCurrentPath(path)

    // Listen for popstate (back/forward browser buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)
    
    PerformanceMonitor.end('app-init')
    
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])
  
  // Escuchar cambios en los datos para actualizar el usuario actual
  useEffect(() => {
    const handleDataUpdate = () => {
      if (user) {
        console.log("[App] Data updated, refreshing current user...")
        refreshUser()
      }
    }
    
    const handleUserDeleted = (event: Event) => {
      const customEvent = event as CustomEvent
      const { userId } = customEvent.detail
      
      if (user?.id === userId) {
        console.log("[App] Current user was deleted, logging out...")
        refreshUser() // Esto detectará que el usuario no existe y cerrará sesión
      }
    }
    
    const handleRoleChanged = (event: Event) => {
      const customEvent = event as CustomEvent
      const { userId, newRole } = customEvent.detail
      
      if (user?.id === userId) {
        console.log(`[App] Current user role changed to ${newRole}, refreshing...`)
        refreshUser()
        
        // Redirigir según el nuevo rol si está en una página restringida
        setTimeout(() => {
          const restrictedPaths = ['/dashboard/admin', '/company-applications', '/publish', '/applications']
          if (restrictedPaths.some(path => currentPath.startsWith(path))) {
            window.location.href = '/'
          }
        }, 500)
      }
    }
    
    window.addEventListener('talentbridge-data-updated', handleDataUpdate)
    window.addEventListener('user-deleted', handleUserDeleted)
    window.addEventListener('user-role-changed', handleRoleChanged)
    
    return () => {
      window.removeEventListener('talentbridge-data-updated', handleDataUpdate)
      window.removeEventListener('user-deleted', handleUserDeleted)
      window.removeEventListener('user-role-changed', handleRoleChanged)
    }
  }, [user, refreshUser, currentPath])

  // Optimize redirects with immediate navigation
  useEffect(() => {
    if (!user && currentPath !== "/login" && currentPath !== "/registro") {
      // Use replace instead of href for better performance
      window.history.replaceState({}, '', '/login')
      setCurrentPath('/login')
    }
  }, [user, currentPath])

  // Early returns for better performance
  if (user && (currentPath === "/login" || currentPath === "/registro")) {
    window.history.replaceState({}, '', '/')
    setCurrentPath('/')
    return null
  }

  // Login/Register pages (redirect to App Router)
  if (currentPath === "/login") {
    window.location.href = "/login"
    return null
  }

  if (currentPath === "/registro") {
    return <RegisterPage />
  }

  // Protected pages (with AppShell)
  if (!user) {
    return null // Will redirect in useEffect
  }

  // Memoize the page rendering to prevent unnecessary re-renders
  const currentPage = useMemo(() => {
    PerformanceMonitor.start('page-render')
    
    // Messages routes - handle in SPA for seamless navigation
    if (currentPath === "/messages" || currentPath === "/mensajes") {
      PerformanceMonitor.end('page-render')
      return <MessagesPage />
    }
    if (currentPath.startsWith("/messages/") || currentPath.startsWith("/mensajes/")) {
      // Handle message detail in SPA
      PerformanceMonitor.end('page-render')
      return <MessageDetailPage />
    }

    // Applications routes - handle in SPA for seamless navigation  
    if (currentPath === "/applications" || currentPath === "/postulaciones") {
      PerformanceMonitor.end('page-render')
      return <ApplicationsPage />
    }
    
    // Company Applications - handle in SPA
    if (currentPath === "/company-applications") {
      if (user.role !== "empresa" && user.role !== "admin") {
        PerformanceMonitor.end('page-render')
        return <UnauthorizedPage />
      }
      PerformanceMonitor.end('page-render')
      return <CompanyApplicationsPage />
    }

    // Profile routes
    if (currentPath === "/profile" || currentPath === "/perfil") {
      PerformanceMonitor.end('page-render')
      return <ProfilePage />
    }
    
    // User profile (viewing other users)
    if (currentPath.startsWith("/user/")) {
      PerformanceMonitor.end('page-render')
      return <UserProfilePage />
    }

    // NOTE: /applications and /company-applications are handled by App Router
    // Don't redirect these routes, let App Router handle them naturally

    // Practice edit (for empresa/admin)
    if (currentPath.startsWith("/oferta/") && currentPath.endsWith("/edit")) {
      if (user.role !== "empresa" && user.role !== "admin") {
        PerformanceMonitor.end('page-render')
        return <UnauthorizedPage />
      }
      PerformanceMonitor.end('page-render')
      return <PublishPage />
    }

    // Practice detail
    if (currentPath.startsWith("/oferta/")) {
      PerformanceMonitor.end('page-render')
      return <PracticeDetailPage />
    }

    // Dashboard routes
    if (currentPath === "/dashboard/estudiante") {
      PerformanceMonitor.end('page-render')
      return <StudentDashboard />
    }
    if (currentPath === "/dashboard/empresa") {
      if (user.role !== "empresa" && user.role !== "admin") {
        PerformanceMonitor.end('page-render')
        return <UnauthorizedPage />
      }
      PerformanceMonitor.end('page-render')
      return <CompanyDashboard />
    }
    if (currentPath === "/dashboard/admin") {
      if (user.role !== "admin") {
        PerformanceMonitor.end('page-render')
        return <UnauthorizedPage />
      }
      PerformanceMonitor.end('page-render')
      return <AdminDashboard />
    }

    // Other routes
    if (currentPath === "/search") {
      PerformanceMonitor.end('page-render')
      return <SearchPage />
    }
    if (currentPath === "/publish") {
      if (user.role !== "empresa" && user.role !== "admin") {
        PerformanceMonitor.end('page-render')
        return <UnauthorizedPage />
      }
      PerformanceMonitor.end('page-render')
      return <PublishPage />
    }
    if (currentPath === "/no-autorizado") {
      PerformanceMonitor.end('page-render')
      return <UnauthorizedPage />
    }

    // Default to home
    PerformanceMonitor.end('page-render')
    return <HomePage />
  }, [currentPath, user?.role])

  return (
    <AppShell>
      {currentPage}
    </AppShell>
  )
}
