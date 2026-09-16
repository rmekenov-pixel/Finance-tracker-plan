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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e11]/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around py-1.5 px-1 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors',
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'p-1 rounded-md transition-colors',
                  isActive ? 'bg-zinc-800 text-emerald-400' : ''
                )}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
