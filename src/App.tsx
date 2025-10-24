"use client"

import { useEffect, useState, useMemo } from "react"
import { AppShell } from "./components/layout/app-shell"
import { HomePage } from "./pages/home"
import { SearchPage } from "./pages/search"
import { PublishPage } from "./pages/publish"
import { ProfilePage } from "./pages/profile"
import { PracticeDetailPage } from "./pages/practice-detail"
import { RegisterPage } from "./pages/register"
import { UnauthorizedPage } from "./pages/unauthorized"
import StudentDashboard from "./components/student-dashboard-client"
import { CompanyDashboard } from "./pages/dashboard/company"
import { AdminDashboard } from "./pages/dashboard/admin"
import { useAuthStore } from "./stores/auth-store"
import { UserProfilePage } from "./pages/user-profile"
import { PerformanceMonitor } from "./utils/performance"

export default function App() {
  const user = useAuthStore((state) => state.user)
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
    
    // NOTE: /messages routes are handled by App Router
    // Don't handle /messages or /messages/* routes here

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
