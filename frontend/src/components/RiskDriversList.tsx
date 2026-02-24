export function RiskDriversList({ drivers }: { drivers: { name: string; impact: number; detail: string }[] }) {
  return (
    <div className="glass p-5">
      <h3 className="mb-3">Risk Drivers</h3>
      <div className="space-y-2 text-sm">
        {drivers.map((d) => (
          <div key={d.name} className="bg-white/5 p-3 rounded-xl">
            <div className="flex justify-between"><span>{d.name}</span><span>{d.impact}%</span></div>
            <p className="text-neutral-400 text-xs">{d.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
