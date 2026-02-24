import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function AuthGate() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function signIn() {
    setError('')
    setSent(false)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) return setError(error.message)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="glass w-full max-w-md p-6">
        <h1 className="text-xl font-semibold">RegIntel</h1>
        <p className="text-sm text-neutral-400 mt-1">Sign in to access your dashboard.</p>

        <div className="mt-5 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-white/10 rounded-xl px-3 py-2 outline-none"
          />

          <button onClick={signIn} className="w-full rounded-xl px-3 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 transition">
            Send magic link
          </button>

          {sent && <p className="text-xs text-neutral-300">Check your email for the sign-in link.</p>}
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  )
}
