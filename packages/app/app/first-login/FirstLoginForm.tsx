'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yup } from '@climbingtopos/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import Form, { AutoComplete } from '@/app/elements/Form';
import { popupError } from '@/app/helpers/alerts';
import { redirect, useRouter } from 'next/navigation';
import Compressor from 'compressorjs';

import { updateUser, type AccountSetupForm } from './actions';
import Input from '../elements/Input';
import Button, { ButtonType, Color } from '../elements/Button';
import { useState } from 'react';

const AccountSetupFormSchema = yup
  .object({
    username: yup.string().required('Required'),
    profilePicure: yup.mixed().notRequired(),
  })
  .required();

function FirstLoginForm() {
  const [imageFileName, setImageFileName] = useState<string>();
  const [imagePreviewUrl, setImagePreview] = useState<string>();
  const [compressedImage, setCompressedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const router = useRouter();

  const { register, handleSubmit, formState, watch } =
    useForm<AccountSetupForm>({
      resolver: yupResolver(AccountSetupFormSchema),
    });

  const formOnSubmit: SubmitHandler<AccountSetupForm> = async (
    value: AccountSetupForm,
  ) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', value.username);

      // Use compressed image if available, otherwise use original
      const imageToUpload = compressedImage || value.profilePicure[0];
      if (imageToUpload) {
        formData.append('profilePicure', imageToUpload);
      }

      await updateUser(formData);

      setTimeout(() => {
        router.replace('/profile');
      });
    } catch (error: any) {
      console.error(error);
      popupError('Something has gone wrong, try again');
    } finally {
      setLoading(false);
    }
  };

  async function onImageSelected() {
    const files = (
      document.querySelector('input[type=file]') as HTMLInputElement
    ).files;

    if (files?.item(0)) {
      const file = files.item(0);

      setImageFileName(file?.name ?? 'Unnamed Image');
      setCompressing(true);

      // Compress the image
      new Compressor(file, {
        quality: 0.8, // 80% quality
        maxWidth: 800, // Max width for profile images
        maxHeight: 800, // Max height for profile images
        mimeType: 'image/jpeg', // Convert to JPEG for better compression

        success(compressedBlob) {
          // Convert Blob to File
          const compressedFile = new File(
            [compressedBlob],
            file.name.replace(/\.[^/.]+$/, '.jpg'), // Change extension to .jpg
            { type: 'image/jpeg' }
          );

          // Create preview URL from compressed image
          const imagePreviewUrl = URL.createObjectURL(compressedBlob);

          setCompressedImage(compressedFile);
          setImagePreview(imagePreviewUrl);
          setCompressing(false);

          console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
          console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
          console.log('Compression ratio:', ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%');
        },

        error(err) {
          console.error('Image compression failed:', err);
          // Fallback: use original image if compression fails
          const imagePreviewUrl = URL.createObjectURL(file);
          setImagePreview(imagePreviewUrl);
          setCompressing(false);
          popupError('Image compression failed, using original image');
        },
      });
    } else {
      setImageFileName('');
      setImagePreview('');
      setCompressedImage(null);
    }
  }

  return (
    <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={AutoComplete.off}>
      <Input
        label="Username"
        {...register('username')}
        error={formState.errors.username?.message}
      />

      <div className="field">
        <label className="label">Profile picture</label>

        <div className="file has-name is-boxed">
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
        </div>

        <p className="help">
          Optional. Images will be automatically compressed and resized to 800x800px.
        </p>
        {compressing && (
          <p className="help has-text-info">
            <i className="fas fa-spinner fa-spin"></i> Compressing image...
          </p>
        )}
      </div>
      <p>{formState.errors.profilePicture?.message}</p>
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
  );
}

export default FirstLoginForm;
