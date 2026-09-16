import React from 'react'
import { cn } from '../lib/clsx'

interface ProgressBarProps {
  current: number
  target: number
  color?: string
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  color = 'bg-emerald-500',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, target > 0 ? (current / target) * 100 : 0))

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span>{percentage.toFixed(0)}%</span>
        <span>
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
