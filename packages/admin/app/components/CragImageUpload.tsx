'use client';

import { useRef, useState, useTransition } from 'react';
import { uploadCragImage } from '@/app/actions';

export default function CragImageUpload({
  slug,
  currentImage,
}: {
  slug: string;
  currentImage?: string;
}) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    setError(null);
    startTransition(async () => {
      const result = await uploadCragImage(slug, formData);
      if (!result.success) {
        setError(result.error ?? 'Upload failed');
        setPreview(currentImage);
      }
    });
  }

  return (
    <div className="detail-card">
      <h3>Image</h3>
      {preview ? (
        <img
          src={preview}
          alt="crag"
          style={{
            width: '100%',
            borderRadius: 6,
            objectFit: 'cover',
            maxHeight: 200,
            marginBottom: '0.75rem',
          }}
        />
      ) : (
        <div className="image-upload-placeholder">No image</div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        className={`button is-small is-primary${isPending ? ' is-loading' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        type="button"
      >
        {preview ? 'Replace Image' : 'Upload Image'}
      </button>
      {error && (
        <p className="has-text-danger" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
