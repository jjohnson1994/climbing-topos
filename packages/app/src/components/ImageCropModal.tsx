import Cropper from 'react-easy-crop'
import { useState, useCallback } from 'react'
import type { Area } from 'react-easy-crop'
import { getCroppedImage } from '@/helpers/cropImage'

interface ImageCropModalProps {
  imageSrc: string
  onCropComplete: (file: File) => void
  onCancel: () => void
}

export function ImageCropModal({ imageSrc, onCropComplete, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [applying, setApplying] = useState(false)

  const onCropChange = useCallback((c: { x: number; y: number }) => setCrop(c), [])
  const onZoomChange = useCallback((z: number) => setZoom(z), [])
  const onCropCompleteCallback = useCallback((_: Area, pixels: Area) => setCroppedAreaPixels(pixels), [])

  async function handleApply() {
    if (!croppedAreaPixels) return
    setApplying(true)
    try {
      const file = await getCroppedImage(imageSrc, croppedAreaPixels)
      onCropComplete(file)
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onCancel} />
      <div className="modal-card" style={{ width: 'min(92vw, 700px)', maxHeight: '90vh' }}>
        <header className="modal-card-head">
          <p className="modal-card-title">Crop Image</p>
          <button className="delete" aria-label="close" onClick={onCancel} />
        </header>
        <section className="modal-card-body" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#111' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              style={{
                containerStyle: { borderRadius: 0 },
              }}
            />
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            <label className="label" style={{ marginBottom: '0.25rem' }}>Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
          <button className="button" onClick={onCancel}>Cancel</button>
          <button
            className={`button is-primary${applying ? ' is-loading' : ''}`}
            onClick={handleApply}
            disabled={applying}
          >
            Apply Crop
          </button>
        </footer>
      </div>
    </div>
  )
}
