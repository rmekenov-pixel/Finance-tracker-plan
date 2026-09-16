import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  KanbanSquare,
  StickyNote,
  BarChart3,
  User,
  LogOut,
  Wallet,
} from 'lucide-react'
import { useUserStore } from '@/entities/user/model/userStore'
import { cn } from '@/shared/lib/clsx'

export const Sidebar: React.FC = () => {
  const { user, logout } = useUserStore()

  const navItems = [
    { to: '/app/dashboard', label: 'Главная', icon: LayoutDashboard },
    { to: '/app/transactions', label: 'Транзакции', icon: ArrowLeftRight },
    { to: '/app/kanban', label: 'Цели & Канбан', icon: KanbanSquare },
    { to: '/app/notes', label: 'Заметки', icon: StickyNote },
    { to: '/app/analytics', label: 'Аналитика', icon: BarChart3 },
    { to: '/app/profile', label: 'Профиль', icon: User },
  ]

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between p-4 min-h-screen shrink-0">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-lg leading-tight">FinanceTracker</h1>
            <p className="text-xs text-slate-400">Личный помощник</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200 truncate max-w-[110px]">
              {user?.name || 'Пользователь'}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-[110px]">{user?.currency || 'KZT'}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Выйти"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
