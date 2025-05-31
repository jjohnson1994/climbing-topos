'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yup } from '@climbingtopos/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import Form, { AutoComplete } from '@/app/elements/Form';
import { popupError } from '@/app/helpers/alerts';
import { redirect, useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState(false);

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
      formData.append('profilePicure', value.profilePicure[0]);

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
      const imagePreviewUrl = URL.createObjectURL(file);

      setImageFileName(file?.name ?? 'Unnamed Image');
      setImagePreview(imagePreviewUrl);
    } else {
      setImageFileName('');
      setImagePreview('');
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

        <p className="help">Optional</p>
      </div>
      <p>{formState.errors.profilePicture?.message}</p>
      <hr />
      <Button
        color={Color.isPrimary}
        type={ButtonType.Submit}
        loading={loading}
      >
        Save
      </Button>
    </Form>
  );
}

export default FirstLoginForm;
