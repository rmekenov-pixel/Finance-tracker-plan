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
        {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
