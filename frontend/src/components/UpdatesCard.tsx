export function UpdatesCard({ updates }: { updates: { headline: string; date: string }[] }) {
  return (
    <div className="glass p-5">
      <h3>Regulatory Updates</h3>
      <ul className="mt-2 text-sm space-y-2">
        {updates.map((u) => <li key={u.headline}>{u.headline}</li>)}
      </ul>
    </div>
  )
}
