import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookTemplate, LogOut } from '@ui/icons'
import { Logo } from './logo'
import { RankBadge } from './rank-badge'
import { useAuth } from '@features/auth/providers/auth-provider'
import { ROUTES } from '@shared/constants/routes'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: 'Templates', icon: BookTemplate, to: ROUTES.TEMPLATES },
]

export function AppLayout({ children }: AppLayoutProps) {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-brand-50/50 flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.DASHBOARD}>
              <Logo />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-0.5">
              {navItems.map(({ label, icon: Icon, to }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={clsx(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                      active
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-brand-500 hover:text-brand-800 hover:bg-brand-50',
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <RankBadge />
            <span className="text-xs text-brand-400 hidden md:block max-w-[140px] truncate">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-brand-500 hover:text-brand-800 hover:bg-brand-50 transition-all duration-150 font-medium"
              title="Sign out"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 sm:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-100">
        <div className="flex items-center">
          {navItems.map(({ label, icon: Icon, to }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 py-3 transition-colors',
                  active ? 'text-brand-700' : 'text-brand-400',
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleSignOut}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-brand-400 transition-colors"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold">Sign out</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
