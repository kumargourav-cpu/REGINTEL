export function RiskGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score))
  const angle = (pct / 100) * 180
  return (
    <div className="glass p-6">
      <h3 className="mb-2">Audit Risk Score</h3>
      <svg viewBox="0 0 200 120" className="w-full h-44">
        <path d="M20 100 A80 80 0 0 1 180 100" stroke="#334155" strokeWidth="16" fill="none" />
        <path d="M20 100 A80 80 0 0 1 180 100" stroke="#22d3ee" strokeWidth="16" fill="none" strokeDasharray={`${(angle / 180) * 251} 999`} />
        <text x="100" y="95" textAnchor="middle" className="fill-white text-3xl font-bold">{score}</text>
      </svg>
    </div>
  )
}
