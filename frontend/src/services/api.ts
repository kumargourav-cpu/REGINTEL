import type { JobStatus, Plan, ResultPayload } from '../types'
import { supabase } from '../lib/supabaseClient'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createScan(file: File, jurisdiction: string, companyName: string, plan: Plan): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('jurisdiction', jurisdiction)
  formData.append('company_name', companyName)
  formData.append('plan', plan)

  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: await authHeaders(),
    body: formData,
  })

  if (!res.ok) throw new Error(`Scan failed: ${await res.text()}`)
  const data = await res.json()
  return data.job_id
}

export async function getJob(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error('Failed job status fetch')
  return res.json()
}

export async function getResults(jobId: string): Promise<ResultPayload> {
  const res = await fetch(`${API_BASE}/results/${jobId}`, { headers: await authHeaders() })
  if (!res.ok) throw new Error('Failed results fetch')
  return res.json()
}

export async function simulatePenalty(plan: Plan, scenario: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/penalty/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ plan, scenario }),
  })
  return res.json()
}
