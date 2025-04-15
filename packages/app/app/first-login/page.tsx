'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yup } from '@climbingtopos/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import Form, { AutoComplete } from '@/app/elements/Form';
import { popupError } from '@/app/helpers/alerts';

import { updateUser, type AccountSetupForm } from './actions';
import Input from '../elements/Input';
import Button, { ButtonType, Color } from '../elements/Button';

const AccountSetupFormSchema = yup
  .object({
    username: yup.string().required('Required'),
    profilePicure: yup.mixed().required('Required'),
  })
  .required();

function FirstLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountSetupForm>({
    resolver: yupResolver(AccountSetupFormSchema),
  });

  const formOnSubmit: SubmitHandler<AccountSetupForm> = async (
    value: AccountSetupForm,
  ) => {
    try {
      const formData = new FormData();
      formData.append('username', value.username);
      formData.append('profilePicure', value.profilePicure[0]);

      await updateUser(formData);
    } catch (error: any) {
      console.error(error);
      popupError('Something has gone wrong, try again');
    }
  };

  return (
    <section className="section">
      <h1 className="title">Welcome to ClimbingTopos</h1>
      <div className="container">
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.off}
        >
          <Input
            label="Username"
            {...register('username')}
            error={errors.username?.message}
          />
          <div className="file has-name">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                {...register('profilePicure')}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label"> Choose a file… </span>
              </span>
              <span className="file-name">
                {' '}
                Screen Shot 2017-07-29 at 15.54.25.png{' '}
              </span>
            </label>
          </div>
          <p>{errors.profilePicture?.message}</p>
          <hr />
          <Button color={Color.isPrimary} type={ButtonType.Submit}>
            Save
          </Button>
        </Form>
      </div>
    </section>
  );
}

export default FirstLogin;
