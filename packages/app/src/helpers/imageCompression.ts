import Compressor from 'compressorjs'

export function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth,
      maxHeight,
      mimeType: 'image/webp',
      success(blob) {
        resolve(
          new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
          }),
        )
      },
      error: reject,
    })
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
