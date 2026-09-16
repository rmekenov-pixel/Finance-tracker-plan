import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  KanbanSquare,
  StickyNote,
  BarChart3,
  User,
} from 'lucide-react'
import { cn } from '@/shared/lib/clsx'

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/app/dashboard', label: 'Главная', icon: LayoutDashboard },
    { to: '/app/transactions', label: 'Транзакции', icon: ArrowLeftRight },
    { to: '/app/kanban', label: 'Цели', icon: KanbanSquare },
    { to: '/app/notes', label: 'Заметки', icon: StickyNote },
    { to: '/app/analytics', label: 'Аналитика', icon: BarChart3 },
    { to: '/app/profile', label: 'Профиль', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-all',
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : ''
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
