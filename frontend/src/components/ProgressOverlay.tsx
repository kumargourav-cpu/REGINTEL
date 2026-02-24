import { motion } from 'framer-motion'

const steps = ['Uploading', 'Parsing', 'Risk Scoring', 'Generating Insights']

export function ProgressOverlay({ progress, step }: { progress: number; step: string }) {
  return (
    <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass p-8 w-[520px]">
        <p className="mb-3">Scanning in progress...</p>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {steps.map((s) => (
            <div key={s} className={s === step ? 'text-cyan-300' : 'text-neutral-400'}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
