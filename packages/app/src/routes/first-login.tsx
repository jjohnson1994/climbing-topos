import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yup } from '@climbingtopos/schemas'
import { yupResolver } from '@hookform/resolvers/yup'
import Form, { AutoComplete } from '@/elements/Form'
import { popupError } from '@/helpers/alerts'
import Input from '@/elements/Input'
import Button, { ButtonType, Color } from '@/elements/Button'
import { useState } from 'react'
import { patchFn as updateUserFn } from '@/data/actions/profile/patch'
import { compressImage, fileToBase64 } from '@/helpers/imageCompression'
import { FileInput } from '@/components/FileInput'
import { getAuthUser } from '@/lib/auth'

export const Route = createFileRoute('/first-login')({
  loader: async () => {
    const user = await getAuthUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return { user }
  },
  component: FirstLoginPage,
})

interface AccountSetupForm {
  username: string
  profilePicure: FileList
}

const AccountSetupFormSchema = yup
  .object({
    username: yup.string().required('Required'),
    profilePicure: yup.mixed().notRequired(),
  })
  .required()

function FirstLoginPage() {
  const [imageFileName, setImageFileName] = useState<string>()
  const [imagePreviewUrl, setImagePreview] = useState<string>()
  const [compressedImageBase64, setCompressedImageBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm<AccountSetupForm>({
    resolver: yupResolver(AccountSetupFormSchema),
  })

  const formOnSubmit: SubmitHandler<AccountSetupForm> = async (value) => {
    setLoading(true)

    try {
      const result = await updateUserFn({
        data: {
          username: value.username,
          profilePictureBase64: compressedImageBase64 ?? undefined,
        },
      })

      if (result?.error) {
        popupError(result.error)
        return
      }

      navigate({ to: '/profile' })
    } catch (error) {
      popupError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  function processImageFile(file: File) {
    setImageFileName(file?.name ?? 'Unnamed Image')
    setCompressing(true)

    compressImage(file, 2000, 2000)
      .then(async (compressedFile) => {
        const base64 = await fileToBase64(compressedFile)
        setCompressedImageBase64(base64)
        setImagePreview(URL.createObjectURL(compressedFile))
        setCompressing(false)
      })
      .catch(() => {
        setImagePreview(URL.createObjectURL(file))
        setCompressing(false)
        popupError('Image compression failed, please try again')
      })
  }

  function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    } else {
      setImageFileName('')
      setImagePreview('')
      setCompressedImageBase64(null)
    }
  }

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Welcome to ClimbingTopos.com</h1>
        <h5 className="subtitle is-5">Let&apos;s setup your account</h5>
        <div className="container">
          <Form
            onSubmit={handleSubmit(formOnSubmit)}
            autoComplete={AutoComplete.off}
          >
            <Input
              label="Username"
              {...register('username')}
              error={formState.errors.username?.message}
            />

            <div className="field">
              <label className="label">Profile picture</label>

              <FileInput onFileSelected={processImageFile} className="is-boxed">
                <label className="file-label">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    {...register('profilePicure')}
                    onChange={onImageSelected}
                  />
                  {imagePreviewUrl && (
                    <span className="file-cta">
                      <figure
                        className="image is-1by1"
                        style={{ width: '100%', maxWidth: '150px' }}
                      >
                        <img
                          src={imagePreviewUrl}
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: '4px',
                          }}
                        />
                      </figure>
                    </span>
                  )}
                  {!imagePreviewUrl && (
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label"> Choose a file… </span>
                    </span>
                  )}
                  {imageFileName && (
                    <span className="file-name"> {imageFileName} </span>
                  )}
                </label>
              </FileInput>

              <p className="help">
                Optional. Images will be automatically compressed and resized to
                800x800px.
              </p>
              {compressing && (
                <p className="help has-text-info">
                  <i className="fas fa-spinner fa-spin"></i> Compressing
                  image...
                </p>
              )}
            </div>
            <hr />
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={loading}
              disabled={compressing}
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    </section>
  )
}
