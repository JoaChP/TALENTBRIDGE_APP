"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "./components/layout/app-shell"
import { ProtectedRoute } from "./components/protected-route"
import { HomePage } from "./pages/home"
import { SearchPage } from "./pages/search"
import { PublishPage } from "./pages/publish"
import { MessagesPage } from "./pages/messages"
import { ProfilePage } from "./pages/profile"
import { PracticeDetailPage } from "./pages/practice-detail"
import { LoginPage } from "./pages/login"
import { RegisterPage } from "./pages/register"
import { UnauthorizedPage } from "./pages/unauthorized"
import { StudentDashboard } from "./pages/student/dashboard"
import { CompanyDashboard } from "./pages/dashboard/company"
import { AdminDashboard } from "./pages/dashboard/admin"
import { useAuthStore } from "./stores/auth-store"

export default function App() {
  const user = useAuthStore((state) => state.user)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/registro" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/publicar" element={<PublishPage />} />
          <Route path="/mensajes" element={<MessagesPage />} />
          <Route path="/mensajes/:id" element={<MessagesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/oferta/:id" element={<PracticeDetailPage />} />
          <Route path="/dashboard/estudiante" element={<StudentDashboard />} />
          <Route path="/dashboard/empresa" element={<CompanyDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/no-autorizado" element={<UnauthorizedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
