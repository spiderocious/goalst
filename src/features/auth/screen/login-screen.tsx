import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { useLogin } from '../api/use-login'

export function LoginScreen() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login.mutateAsync({ email, password })
      navigate(ROUTES.DASHBOARD)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-950">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950" />
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">goalst</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Turn ambition<br />into achievement.
            </h1>
            <p className="text-brand-300 text-lg leading-relaxed">
              Track goals, build momentum, and reach every milestone — one step at a time.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '◎', text: 'Recursive sub-goals that auto-track progress' },
              { icon: '⚡', text: 'Priority scoring and rank system' },
              { icon: '↗', text: 'Collaborate and share goals with others' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-brand-400 text-lg leading-none">{icon}</span>
                <span className="text-brand-200 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-brand-500 text-xs">© 2026 Goalst. Built for achievers.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="font-bold text-brand-900 text-lg">goalst</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-950 mb-1.5">Welcome back</h2>
            <p className="text-brand-500 text-sm">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                Email
              </label>
              <div className={`relative rounded-xl border-2 transition-all duration-200 ${
                focused === 'email' ? 'border-brand-500 shadow-sm shadow-brand-100' : 'border-brand-100 hover:border-brand-200'
              }`}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-transparent text-brand-950 text-sm outline-none placeholder:text-brand-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                Password
              </label>
              <div className={`relative rounded-xl border-2 transition-all duration-200 ${
                focused === 'password' ? 'border-brand-500 shadow-sm shadow-brand-100' : 'border-brand-100 hover:border-brand-200'
              }`}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-transparent text-brand-950 text-sm outline-none placeholder:text-brand-300"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <span className="text-red-500 text-sm mt-px">⚠</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-200 hover:shadow-brand-300 hover:-translate-y-px mt-2"
            >
              {login.isPending && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-brand-400 mt-6">
            New here?{' '}
            <Link to={ROUTES.SIGNUP} className="text-brand-700 font-semibold hover:text-brand-900 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
