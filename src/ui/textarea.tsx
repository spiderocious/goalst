import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={clsx(
            'w-full rounded-xl border-2 px-4 py-2.5 text-sm bg-white text-brand-950 resize-y',
            'placeholder:text-brand-300 outline-none transition-all duration-150',
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-brand-100 hover:border-brand-200 focus:border-brand-500 focus:shadow-sm focus:shadow-brand-100',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
