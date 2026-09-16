import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from '@/widgets/Sidebar/Sidebar'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { TransactionsPage } from '@/pages/app/TransactionsPage'
import { KanbanPage } from '@/pages/app/KanbanPage'
import { NotesPage } from '@/pages/app/NotesPage'
import { AnalyticsPage } from '@/pages/app/AnalyticsPage'
import { ProfilePage } from '@/pages/app/ProfilePage'

const ProtectedLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app/dashboard" replace />,
  },
])
