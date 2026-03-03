import { Target } from '@ui/icons'
import { clsx } from 'clsx'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { icon: 16, text: 'text-base' },
  md: { icon: 20, text: 'text-xl' },
  lg: { icon: 28, text: 'text-3xl' },
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const { icon, text } = sizeMap[size]
  return (
    <div className={clsx('flex items-center gap-1.5 font-bold text-brand-800', className)}>
      <Target size={icon} className="text-brand-600" strokeWidth={2.5} />
      <span className={text}>goalst</span>
    </div>
  )
}
