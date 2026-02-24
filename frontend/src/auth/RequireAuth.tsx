import { ReactNode } from 'react'
import { useAuth } from './useAuth'
import { AuthGate } from './AuthGate'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">Loading…</div>
  if (!user) return <AuthGate />

  return <>{children}</>
}
