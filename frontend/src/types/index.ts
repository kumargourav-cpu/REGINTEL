export type Plan = 'Basic' | 'Pro' | 'Enterprise'

export type JobStatus = {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  step: string
  message: string
}

export type ResultPayload = {
  job_id: string
  plan: Plan
  jurisdiction: string
  company_name: string
  risk_score: number
  drivers: { name: string; impact: number; detail: string }[]
  penalty_estimate: { minimum: number; maximum: number; currency: string }
  updates: { headline: string; date: string }[]
  benchmark?: { industry_avg: number; percentile: number } | null
  confidence?: number | null
  recommendations?: { title: string; owner: string; due_in_days: number }[] | null
  penalty_simulator?: Record<string, unknown> | null
  dispute_draft?: string | null
  action_plan?: Record<string, unknown> | null
  export_enabled: boolean
}
