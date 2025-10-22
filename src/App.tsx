"use client"

import { useEffect, useState } from "react"
import { AppShell } from "./components/layout/app-shell"
import { HomePage } from "./pages/home"
import { SearchPage } from "./pages/search"
import { PublishPage } from "./pages/publish"
import { MessagesPage } from "./pages/messages"
import { ProfilePage } from "./pages/profile"
import { PracticeDetailPage } from "./pages/practice-detail"
import { LoginPage } from "./pages/login"
import { RegisterPage } from "./pages/register"
import { UnauthorizedPage } from "./pages/unauthorized"
import { ApplicationsPage } from "./pages/applications"
import { CompanyApplicationsPage } from "./pages/company-applications"
import StudentDashboard from "./components/student-dashboard-client"
import { CompanyDashboard } from "./pages/dashboard/company"
import { AdminDashboard } from "./pages/dashboard/admin"
import { useAuthStore } from "./stores/auth-store"

export default function App() {
  const user = useAuthStore((state) => state.user)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    // Get current path
    const path = window.location.pathname
    setCurrentPath(path)

    // Listen for popstate (back/forward browser buttons)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && currentPath !== "/login" && currentPath !== "/registro") {
      window.location.href = "/login"
    }
  }, [user, currentPath])

  // Redirect to home if already logged in
  if (user && (currentPath === "/login" || currentPath === "/registro")) {
    window.location.href = "/"
    return null
  }

  // Login/Register pages (no AppShell)
  if (currentPath === "/login") {
    return <LoginPage />
  }

  if (currentPath === "/registro") {
    return <RegisterPage />
  }

  // Protected pages (with AppShell)
  if (!user) {
    return null // Will redirect in useEffect
  }

  const renderPage = () => {
    // Messages routes
    if (currentPath === "/messages" || currentPath === "/mensajes") {
      return <MessagesPage />
    }
    if (currentPath.startsWith("/messages/") || currentPath.startsWith("/mensajes/")) {
      return <MessagesPage />
    }

    // Profile routes
    if (currentPath === "/profile" || currentPath === "/perfil") {
      return <ProfilePage />
    }

    // Applications routes
    if (currentPath === "/applications" || currentPath === "/postulaciones") {
      return <ApplicationsPage />
    }
    
    // Company applications route
    if (currentPath === "/company-applications" || currentPath === "/aplicaciones-empresa") {
      if (user.role !== "empresa" && user.role !== "admin") {
        return <UnauthorizedPage />
      }
      return <CompanyApplicationsPage />
    }

    // Practice detail
    if (currentPath.startsWith("/oferta/")) {
      return <PracticeDetailPage />
    }

    // Dashboard routes
    if (currentPath === "/dashboard/estudiante") {
      return <StudentDashboard />
    }
    if (currentPath === "/dashboard/empresa") {
      if (user.role !== "empresa" && user.role !== "admin") {
        return <UnauthorizedPage />
      }
      return <CompanyDashboard />
    }
    if (currentPath === "/dashboard/admin") {
      if (user.role !== "admin") {
        return <UnauthorizedPage />
      }
      return <AdminDashboard />
    }

    // Other routes
    if (currentPath === "/search") {
      return <SearchPage />
    }
    if (currentPath === "/publish") {
      if (user.role !== "empresa" && user.role !== "admin") {
        return <UnauthorizedPage />
      }
      return <PublishPage />
    }
    if (currentPath === "/no-autorizado") {
      return <UnauthorizedPage />
    }

    // Default to home
    return <HomePage />
  }

  return (
    <AppShell>
      {renderPage()}
    </AppShell>
  )
}
