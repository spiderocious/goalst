import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white border border-brand-700 hover:bg-brand-800 hover:border-brand-800 active:bg-brand-900 shadow-sm hover:shadow-md shadow-brand-200 hover:-translate-y-px',
  secondary:
    'bg-white text-brand-800 border border-brand-200 hover:bg-brand-50 hover:border-brand-300 active:bg-brand-100 shadow-sm',
  ghost:
    'bg-transparent text-brand-700 border border-transparent hover:bg-brand-50 active:bg-brand-100',
  danger:
    'bg-red-600 text-white border border-red-600 hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md shadow-red-200 hover:-translate-y-px',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
