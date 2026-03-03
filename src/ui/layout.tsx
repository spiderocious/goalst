import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookTemplate, LogOut } from '@ui/icons'
import { Logo } from './logo'
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
    <div className="min-h-screen flex flex-col bg-brand-50">
      {/* Top nav */}
      <header className="bg-white border-b-2 border-brand-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="flex items-center gap-1">
              {navItems.map(({ label, icon: Icon, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors',
                    location.pathname === to
                      ? 'bg-brand-100 text-brand-800'
                      : 'text-brand-500 hover:text-brand-800 hover:bg-brand-50',
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-800 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
