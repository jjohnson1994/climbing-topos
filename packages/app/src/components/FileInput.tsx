import { useRef, useState } from 'react'

interface FileInputProps {
  onFileSelected: (file: File) => void
  children: React.ReactNode
  className?: string
}

export function FileInput({ onFileSelected, children, className = '' }: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    const input = ref.current?.querySelector('input[type="file"]') as HTMLInputElement | null
    if (input) {
      const dt = new DataTransfer()
      dt.items.add(file)
      input.files = dt.files
    }
    onFileSelected(file)
  }

  const classes = ['file', 'has-name', isDragging ? 'is-info' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {children}
    </div>
  )
}
