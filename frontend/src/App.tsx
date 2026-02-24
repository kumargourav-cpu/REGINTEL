import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BenchmarkCard } from './components/BenchmarkCard'
import { DisputeCard } from './components/DisputeCard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PenaltySimulator } from './components/PenaltySimulator'
import { ProgressOverlay } from './components/ProgressOverlay'
import { RiskDriversList } from './components/RiskDriversList'
import { RiskGauge } from './components/RiskGauge'
import { UpdatesCard } from './components/UpdatesCard'
import { UploadPanel } from './components/UploadPanel'
import { createScan, getJob, getResults } from './services/api'
import type { JobStatus, Plan, ResultPayload } from './types'
import { RequireAuth } from './auth/RequireAuth'
import { fetchUserPlan, getCachedPlan, setCachedPlan } from './billing/plan'
import { supabase } from './lib/supabaseClient'

const LS_LAST_RESULT = 'regintel_last_result_v1'
const LS_LAST_JOB = 'regintel_last_job_v1'

function AppInner() {
  const [plan, setPlan] = useState<Plan>(getCachedPlan())
  const [jurisdiction, setJurisdiction] = useState('UAE')
  const [companyName, setCompanyName] = useState('Acme Corp')
  const [jobId, setJobId] = useState<string>(() => localStorage.getItem(LS_LAST_JOB) || '')
  const [job, setJob] = useState<JobStatus | null>(null)
  const [result, setResult] = useState<ResultPayload | null>(() => {
    try {
      const raw = localStorage.getItem(LS_LAST_RESULT)
      return raw ? (JSON.parse(raw) as ResultPayload) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchUserPlan().then(setPlan).catch(() => {})
  }, [])

  useEffect(() => {
    setCachedPlan(plan)
  }, [plan])

  useEffect(() => {
    if (!jobId) return
    localStorage.setItem(LS_LAST_JOB, jobId)

    let stopped = false
    const timer = setInterval(async () => {
      try {
        const status = await getJob(jobId)
        if (stopped) return
        setJob(status)

        if (status.status === 'completed') {
          clearInterval(timer)
          const res = await getResults(jobId)
          if (stopped) return
          setResult(res)
          localStorage.setItem(LS_LAST_RESULT, JSON.stringify(res))
        }

        if (status.status === 'failed') {
          clearInterval(timer)
          if (stopped) return
          setError(status.message)
        }
      } catch (e) {
        setError((e as Error).message)
      }
    }, 700)

    return () => {
      stopped = true
      clearInterval(timer)
    }
  }, [jobId])

  async function onFile(file: File) {
    try {
      setError('')
      setResult(null)
      setJob({ status: 'processing', progress: 5, step: 'Uploading', message: 'Preparing upload' })
      const id = await createScan(file, jurisdiction, companyName, plan)
      setJobId(id)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    localStorage.removeItem(LS_LAST_JOB)
    setJobId('')
    setJob(null)
  }

  const planBadge = useMemo(() => plan, [plan])

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-black">
        {job && job.status === 'processing' && <ProgressOverlay progress={job.progress} step={job.step} />}

        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-2 glass p-4 space-y-2 text-sm">
            <div className="text-xs text-neutral-400">Menu</div>
            {['Dashboard', 'Risk Score', 'Penalty Simulator', 'Regulatory Updates', 'Dispute Assistant'].map((n) => (
              <div key={n}>{n}</div>
            ))}
          </aside>

          <main className="col-span-10 space-y-4">
            <div className="glass p-4 flex items-center gap-3">
              <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="bg-white/10 rounded px-3 py-2">
                <option>UAE</option>
              </select>

              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/10 rounded px-3 py-2" />

              <span className="text-xs px-3 py-2 rounded bg-white/10">Plan: {planBadge}</span>

              <button onClick={signOut} className="ml-auto text-xs px-3 py-2 rounded bg-white/10 hover:bg-white/15">
                Sign out
              </button>

              <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20">Confidence {result?.confidence ?? '--'}%</span>
            </div>

            <UploadPanel onFile={onFile} />

            {error && <div className="glass p-3 text-red-300">{error}</div>}

            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <RiskGauge score={result.risk_score} />
                  <RiskDriversList drivers={result.drivers} />
                  <div className="grid grid-cols-2 gap-4">
                    <UpdatesCard updates={result.updates} />
                    <DisputeCard draft={result.dispute_draft} />
                  </div>
                </div>

                <div className="space-y-4">
                  <BenchmarkCard benchmark={result.benchmark} />
                  <PenaltySimulator value={result.penalty_simulator} />
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <RequireAuth>
      <AppInner />
    </RequireAuth>
  )
}
