export function BenchmarkCard({ benchmark }: { benchmark?: { industry_avg: number; percentile: number } | null }) {
  return (
    <div className="glass p-5 h-full">
      <h3>Industry Benchmark</h3>
      {benchmark ? (
        <div className="mt-3 text-sm space-y-2">
          <p>Industry Avg Risk: {benchmark.industry_avg}</p>
          <p>Your Percentile: {benchmark.percentile}th</p>
        </div>
      ) : (
        <p className="text-xs text-neutral-400 mt-3">Upgrade to Pro for benchmarking.</p>
      )}
    </div>
  )
}
