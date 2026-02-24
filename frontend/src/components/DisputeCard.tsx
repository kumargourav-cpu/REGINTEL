export function DisputeCard({ draft }: { draft?: string | null }) {
  return (
    <div className="glass p-5">
      <h3>Dispute Assistant</h3>
      {draft ? (
        <pre className="text-xs text-neutral-300 whitespace-pre-wrap mt-2">{draft}</pre>
      ) : (
        <p className="text-xs mt-2 text-neutral-400">Enterprise plan unlocks objection drafts.</p>
      )}
    </div>
  )
}
