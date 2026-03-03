import { clsx } from 'clsx'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { box: 'w-5 h-5', iconSize: 10, text: 'text-sm' },
  md: { box: 'w-7 h-7', iconSize: 14, text: 'text-lg' },
  lg: { box: 'w-10 h-10', iconSize: 18, text: 'text-2xl' },
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const { box, iconSize, text } = sizeMap[size]
  return (
    <div className={clsx('flex items-center gap-2 font-bold text-brand-800', className)}>
      <div className={clsx('rounded-lg bg-brand-700 flex items-center justify-center flex-shrink-0', box)}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      </div>
      <span className={clsx(text, 'tracking-tight')}>goalst</span>
    </div>
  )
}
