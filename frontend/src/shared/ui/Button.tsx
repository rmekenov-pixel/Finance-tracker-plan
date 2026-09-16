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
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

  const variants = {
    primary:
      'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-xs hover:shadow-emerald-500/10 border border-emerald-400/30',
    secondary:
      'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 hover:border-zinc-600',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 hover:border-rose-500/50',
    ghost:
      'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200',
    outline:
      'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
