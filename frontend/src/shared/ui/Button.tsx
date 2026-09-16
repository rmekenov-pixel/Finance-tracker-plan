import React from 'react'
import { cn } from '../lib/clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20',
    ghost: 'hover:bg-slate-800 text-slate-300',
    outline: 'border border-slate-600 text-slate-200 hover:bg-slate-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
