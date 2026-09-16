import React from 'react'
import { cn } from '../lib/clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'income' | 'expense' | 'saving' | 'task' | 'reminder' | 'default'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    income: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expense: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    saving: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    task: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    reminder: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
