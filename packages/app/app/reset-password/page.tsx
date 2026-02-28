'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonType, Color } from '@/app/elements/Button';
import Form, { AutoComplete } from '@/app/elements/Form';
import Input from '@/app/elements/Input';
import { yup } from '@climbingtopos/schemas';
import { popupError } from '@/app/helpers/alerts';
import { useState } from 'react';
import { post as requestPasswordReset } from '@/app/data/actions/user/password-reset/request';
import { useRouter } from 'next/navigation';

interface ResetPasswordForm {
  email: string;
}

const ResetPasswordSchema = yup
  .object({
    email: yup.string().email('Not an email address').required('Required'),
  })
  .required();

const ResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const formOnSubmit: SubmitHandler<ResetPasswordForm> = async (
    value: ResetPasswordForm,
  ) => {
    setIsLoading(true);
    const result = await requestPasswordReset(value.email);
    setIsLoading(false);
    if (result?.error) {
      popupError(result.error);
      return;
    }
    router.replace(
      `/reset-password/confirm?email=${encodeURIComponent(value.email.toLowerCase().trim())}`,
    );
  };

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Reset Password</h1>
        <p>Enter your email address and we&apos;ll send you a reset code.</p>
        <br />
        <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={AutoComplete.on}>
          <Input
            label="Email"
            {...register('email')}
            error={errors.email?.message}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Send Reset Code
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default ResetPassword;
