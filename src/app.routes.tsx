import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@shared/constants/routes'
import { AppShell } from './app.shell'
import { AuthGuard } from '@features/auth/guards/auth-guard'
import { GuestGuard } from '@features/auth/guards/guest-guard'

const LoginScreen = lazy(() =>
  import('@features/auth/screen/login-screen').then((m) => ({ default: m.LoginScreen }))
)
const SignupScreen = lazy(() =>
  import('@features/auth/screen/signup-screen').then((m) => ({ default: m.SignupScreen }))
)
const DashboardScreen = lazy(() =>
  import('@features/dashboard/screen/dashboard-screen').then((m) => ({ default: m.DashboardScreen }))
)
const GoalDetailScreen = lazy(() =>
  import('@features/goal-detail/screen/goal-detail-screen').then((m) => ({ default: m.GoalDetailScreen }))
)
const SharedGoalScreen = lazy(() =>
  import('@features/shared-goal/screen/shared-goal-screen').then((m) => ({ default: m.SharedGoalScreen }))
)
const TemplatesScreen = lazy(() =>
  import('@features/templates/screen/templates-screen').then((m) => ({ default: m.TemplatesScreen }))
)

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: ROUTES.SHARED_GOAL,
    element: (
      <Suspense fallback={<Loading />}>
        <SharedGoalScreen />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      // Guest-only routes
      {
        element: <GuestGuard />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: (
              <Suspense fallback={<Loading />}>
                <LoginScreen />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SIGNUP,
            element: (
              <Suspense fallback={<Loading />}>
                <SignupScreen />
              </Suspense>
            ),
          },
        ],
      },
      // Auth-required routes
      {
        element: <AuthGuard />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<Loading />}>
                <DashboardScreen />
              </Suspense>
            ),
          },
          {
            path: ROUTES.GOAL_DETAIL,
            element: (
              <Suspense fallback={<Loading />}>
                <GoalDetailScreen />
              </Suspense>
            ),
          },
          {
            path: ROUTES.TEMPLATES,
            element: (
              <Suspense fallback={<Loading />}>
                <TemplatesScreen />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
])
