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
    { to: '/app/kanban', label: 'Цели и Канбан', icon: KanbanSquare },
    { to: '/app/notes', label: 'Заметки', icon: StickyNote },
    { to: '/app/analytics', label: 'Аналитика', icon: BarChart3 },
    { to: '/app/profile', label: 'Профиль', icon: User },
  ]

  return (
    <aside className="hidden md:flex w-60 bg-[#0e0e11] border-r border-zinc-800/80 flex-col justify-between p-3.5 min-h-screen shrink-0">
      <div className="flex flex-col gap-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white uppercase">
              FinanceTracker
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              Личный ассистент
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2.5 mb-1.5">
            Меню
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-zinc-800/90 text-emerald-400 border border-zinc-700/60 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-bold text-zinc-200 text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-200 truncate max-w-[105px]">
              {user?.name || 'Пользователь'}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[105px]">
              {user?.currency || 'KZT'}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-md transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
          title="Выйти"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
