import { useState, useRef, useEffect } from 'react'
import { Upload, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(value)
  useEffect(() => { setPreview(value) }, [value])

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
  }

  const clearImage = () => {
    setPreview('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {preview ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden group">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button type="button" onClick={clearImage}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-slate-600 bg-slate-700/50 cursor-pointer hover:border-slate-500 transition-colors"
        >
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">Klik atau seret gambar ke sini</p>
          <p className="text-xs text-gray-500 mt-1">Maks 2MB</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  )
}
