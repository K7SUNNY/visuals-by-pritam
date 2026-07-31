import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { AdminLayout } from '@/app/layouts/AdminLayout'
import { HomePage } from '@/pages/public/HomePage'
import { PortfolioPage } from '@/pages/public/PortfolioPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { WorksPage } from '@/pages/admin/WorksPage'
import { UploadPage } from '@/pages/admin/UploadPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/constants/config'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role !== ROLES.ADMIN) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="works" element={<WorksPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}