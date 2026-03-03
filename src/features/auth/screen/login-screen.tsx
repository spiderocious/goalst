import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { Button, Input, Logo } from '@ui/index'
import { useLogin } from '../api/use-login'

export function LoginScreen() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white border-2 border-brand-200 rounded-lg p-8">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <Logo size="lg" />
            </div>
            <p className="text-sm text-brand-500">Sign in to track your goals</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" loading={login.isPending} className="w-full mt-1">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-500 mt-4">
          No account?{' '}
          <Link to={ROUTES.SIGNUP} className="text-brand-700 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
