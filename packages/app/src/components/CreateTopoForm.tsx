import { yupResolver } from '@hookform/resolvers/yup'
import { NewTopoSchema } from '@climbingtopos/schemas'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { popupError, popupSuccess } from '@/helpers/alerts'
import { postFn } from '@/data/actions/topos/post'
import { compressImage, fileToBase64 } from '@/helpers/imageCompression'
import { FileInput } from '@/components/FileInput'

const schema = NewTopoSchema()

function CreateTopoForm({
  cragSlug,
  areaSlug,
}: {
  cragSlug: string
  areaSlug: string
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema as any) as any,
    mode: 'onChange',
    defaultValues: {
      orientation: 'unknown',
      imageFileName: '',
      areaSlug,
      cragSlug,
    },
  })

  const watchImageFileName = watch('imageFileName')

  function processImageFile(file: File) {
    setValue('imageFileName', file.name)
    setCompressing(true)

    compressImage(file, 2000, 2000)
      .then(async (compressedFile) => {
        const base64 = await fileToBase64(compressedFile)
        setImageBase64(base64)
        setImagePreview(URL.createObjectURL(compressedFile))
        setCompressing(false)
      })
      .catch(() => {
        setCompressing(false)
        popupError('Image compression failed, please try again')
      })
  }

  function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const formOnSubmit = handleSubmit(async (formData) => {
    setLoading(true)

    try {
      if (!imageBase64) {
        popupError('Please select an image')
        return
      }

      await postFn({
        data: {
          orientation: formData.orientation,
          imageBase64,
          imageFileName: formData.imageFileName,
          cragSlug: formData.cragSlug,
          areaSlug: formData.areaSlug,
        },
      })

      await popupSuccess('Topo Created!')
      navigate({
        to: '/crags/$cragSlug/areas/$areaSlug',
        params: { cragSlug, areaSlug },
      })
    } catch (error) {
      popupError('Ahh, something has gone wrong...')
    } finally {
      setLoading(false)
    }
  })

  return (
    <form
      onSubmit={formOnSubmit}
      style={{ display: 'flex', flexDirection: 'column' }}
      autoComplete="off"
    >
      <input type="text" value={cragSlug} {...register('cragSlug')} className="is-hidden" />
      <input type="text" value={areaSlug} {...register('areaSlug')} className="is-hidden" />
      <input type="text" {...register('imageFileName')} className="is-hidden" />

      <div className="field">
        <label className="label">Image</label>
        <div className="control">
          <FileInput onFileSelected={processImageFile}>
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={onImageSelected}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Choose a file…</span>
              </span>
              <span className="file-name">{watchImageFileName}</span>
            </label>
          </FileInput>
        </div>
        <p className="help is-danger">{errors.imageFileName?.message}</p>
      </div>

      {imagePreview && (
        <div className="field">
          <div className="control">
            <figure className="image">
              <img src={imagePreview} alt="topo preview" />
            </figure>
          </div>
        </div>
      )}

      <div className="field">
        <label className="label">Orientation</label>
        <div className="control">
          <div className="select">
            <select {...register('orientation')}>
              <option value="unknown">Unknown</option>
              <option value="north">North</option>
              <option value="north-east">North East</option>
              <option value="east">East</option>
              <option value="south-east">South East</option>
              <option value="south">South</option>
              <option value="south-west">South West</option>
              <option value="west">West</option>
              <option value="north-west">North West</option>
            </select>
          </div>
        </div>
        <p className="help is-danger">{errors.orientation?.message}</p>
      </div>

      <div className="field">
        <div className="field is-flex is-justified-end">
          <div className="control">
            <button
              type="submit"
              className={`button is-primary ${loading || compressing ? 'is-loading' : ''}`}
              disabled={compressing}
            >
              <span>Create Topo</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreateTopoForm
