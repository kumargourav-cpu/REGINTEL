export function PenaltySimulator({ value }: { value?: Record<string, unknown> | null }) {
  return (
    <div className="glass p-5">
      <h3>Penalty Simulator</h3>
      <pre className="text-xs mt-2 text-neutral-300 whitespace-pre-wrap">
        {value ? JSON.stringify(value, null, 2) : 'Available on Pro/Enterprise'}
      </pre>
    </div>
  )
}
