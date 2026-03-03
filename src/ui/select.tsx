import { type SelectHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-xl border-2 px-4 py-2.5 text-sm bg-white text-brand-950 outline-none transition-all duration-150 cursor-pointer',
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-brand-100 hover:border-brand-200 focus:border-brand-500 focus:shadow-sm focus:shadow-brand-100',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
