import type { Plan } from '../types'
import { supabase } from '../lib/supabaseClient'

const LS_PLAN = 'regintel_plan_v1'

export function planFromString(v?: string | null): Plan {
  if (v === 'Pro') return 'Pro'
  if (v === 'Enterprise') return 'Enterprise'
  return 'Basic'
}

export function getCachedPlan(): Plan {
  return planFromString(localStorage.getItem(LS_PLAN))
}

export function setCachedPlan(p: Plan) {
  localStorage.setItem(LS_PLAN, p)
}

export async function fetchUserPlan(): Promise<Plan> {
  const { data } = await supabase.auth.getUser()
  const metaPlan = (data.user?.user_metadata?.plan as string | undefined) ?? 'Basic'
  const plan = planFromString(metaPlan)
  setCachedPlan(plan)
  return plan
}
