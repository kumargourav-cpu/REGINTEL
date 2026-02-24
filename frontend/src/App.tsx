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

const LS_LAST_RESULT = 'regintel_last_result_v1'
const LS_LAST_PLAN = 'regintel_plan_v1'

const PLAN_COPY: Record<Plan, { tagline: string; bullets: string[]; note?: string }> = {
  Basic: {
    tagline: 'Fast scan + core risk drivers',
    bullets: ['Risk score + top drivers', 'Penalty estimate range', 'Regulatory update highlights'],
    note: 'Best for quick checks',
  },
  Pro: {
    tagline: 'Analyst view + benchmarking',
    bullets: ['Everything in Basic', 'Benchmark snapshot + confidence', 'Penalty simulator + recommendations'],
    note: 'Best for finance teams',
  },
  Enterprise: {
    tagline: 'Dispute + export + action plan',
    bullets: ['Everything in Pro', 'Dispute draft assistant', 'Exportable JSON + phased action plan'],
    note: 'Best for firms & groups',
  },
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: Plan
  selected: boolean
  onSelect: (p: Plan) => void
}) {
  const c = PLAN_COPY[plan]
  return (
    <button
      onClick={() => onSelect(plan)}
      className={`glass p-5 text-left transition w-full ${selected ? 'glow soft-ring' : 'hover:bg-white/7'} `}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{plan}</div>
          <div className="text-xs text-neutral-400 mt-1">{c.tagline}</div>
        </div>
        {selected && <span className="badge">Selected</span>}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-neutral-200">
        {c.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
            <span className="text-neutral-200">{b}</span>
          </li>
        ))}
      </ul>

      {c.note && <div className="mt-4 text-xs text-neutral-400">{c.note}</div>}
    </button>
  )
}

export default function App() {
  const [plan, setPlan] = useState<Plan>(() => (localStorage.getItem(LS_LAST_PLAN) as Plan) || 'Basic')
  const [jurisdiction, setJurisdiction] = useState('UAE')
  const [companyName, setCompanyName] = useState('Acme Corp')

  const [jobId, setJobId] = useState('')
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
    localStorage.setItem(LS_LAST_PLAN, plan)
  }, [plan])

  useEffect(() => {
    if (!jobId) return
    const timer = setInterval(async () => {
      try {
        const status = await getJob(jobId)
        setJob(status)

        if (status.status === 'completed') {
          clearInterval(timer)
          const res = await getResults(jobId)
          setResult(res)
          localStorage.setItem(LS_LAST_RESULT, JSON.stringify(res))
        }

        if (status.status === 'failed') {
          clearInterval(timer)
          setError(status.message)
        }
      } catch (e) {
        clearInterval(timer)
        setError((e as Error).message)
      }
    }, 700)

    return () => clearInterval(timer)
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

  const confidence = useMemo(() => (result?.confidence ?? null), [result])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[90px]" />
          <div className="absolute top-20 right-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
          <div className="absolute bottom-[-180px] left-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative p-6 max-w-6xl mx-auto">
          {job && job.status === 'processing' && <ProgressOverlay progress={job.progress} step={job.step} />}

          {/* Header */}
          <div className="glass glow p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold tracking-tight">RegIntel</div>
                <div className="text-sm text-neutral-300 mt-1">
                  Premium compliance scanning prototype — plan-aware insights, fast workflow, market-ready UI.
                </div>
                <div className="text-xs text-neutral-400 mt-2">
                  MVP note: This tool is under development. Outputs are illustrative and not legal advice.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge">Jurisdiction</span>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="bg-white/10 rounded-xl px-3 py-2 text-sm outline-none border border-white/10"
                >
                  <option>UAE</option>
                </select>

                <span className="badge">Company</span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-white/10 rounded-xl px-3 py-2 text-sm outline-none border border-white/10"
                />

                <span className="badge">Confidence</span>
                <span className="badge">{confidence !== null ? `${confidence}%` : '--'}</span>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {(['Basic', 'Pro', 'Enterprise'] as Plan[]).map((p) => (
              <PlanCard key={p} plan={p} selected={plan === p} onSelect={setPlan} />
            ))}
          </div>

          {/* Scanner */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="glass p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Scanner</div>
                    <div className="text-xs text-neutral-400 mt-1">Upload PDF / JPG / PNG / CSV</div>
                  </div>
                  <span className="badge">Plan: {plan}</span>
                </div>
                <div className="mt-4">
                  <UploadPanel onFile={onFile} />
                </div>
                <div className="mt-4 text-xs text-neutral-400">
                  Tip: For best extraction, upload clean PDFs (not scanned photos). Image OCR is stubbed in this MVP.
                </div>
              </div>

              {error && <div className="glass p-4 text-sm text-red-300">{error}</div>}

              {result && (
                <div className="glass p-5">
                  <div className="text-sm text-neutral-300">Penalty Estimate</div>
                  <div className="mt-2 text-xl font-semibold">
                    {result.penalty_estimate.currency} {result.penalty_estimate.minimum.toLocaleString()} —{' '}
                    {result.penalty_estimate.maximum.toLocaleString()}
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">
                    Estimate scales with risk score. Plan controls depth of analysis.
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-4">
              {!result ? (
                <div className="glass p-10 text-center">
                  <div className="text-xl font-semibold">Ready when you are.</div>
                  <div className="mt-2 text-sm text-neutral-400">
                    Choose a plan → upload a document → view risk score, drivers and plan-based intelligence.
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <RiskGauge score={result.risk_score} />
                  <RiskDriversList drivers={result.drivers} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UpdatesCard updates={result.updates} />
                    <DisputeCard draft={result.dispute_draft} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BenchmarkCard benchmark={result.benchmark} />
                    <PenaltySimulator value={result.penalty_simulator} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            © {new Date().getFullYear()} RegIntel — Compliance Intelligence Engine (Prototype)
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
