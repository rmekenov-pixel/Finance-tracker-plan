import React from 'react'
import { cn } from '../lib/clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] text-rose-400">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
