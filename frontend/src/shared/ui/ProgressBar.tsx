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
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-mono text-zinc-400">
        <span className="font-semibold text-zinc-300">{percentage.toFixed(0)}%</span>
        <span>
          {current.toLocaleString('ru-RU')} / {target.toLocaleString('ru-RU')}
        </span>
      </div>
    </div>
  )
}
