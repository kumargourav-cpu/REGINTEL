import { Upload } from 'lucide-react'

export function UploadPanel({ onFile }: { onFile: (file: File) => void }) {
  return (
    <label className="glass p-6 flex flex-col gap-3 cursor-pointer border-dashed">
      <Upload className="w-6 h-6" />
      <span className="text-sm">Drag/drop or browse PDF/JPG/PNG/CSV</span>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.csv"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </label>
  )
}
