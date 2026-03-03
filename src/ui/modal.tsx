import { type ReactNode, useEffect } from 'react'
import { X } from '@ui/icons'
import { clsx } from 'clsx'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl',
          'border-t border-brand-100 sm:border',
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-50">
            <h2 className="text-base font-bold text-brand-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-50 text-brand-400 hover:bg-brand-100 hover:text-brand-700 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
