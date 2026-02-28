'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Suspense, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonType, Color } from '@/app/elements/Button';
import Form, { AutoComplete } from '@/app/elements/Form';
import Input, { InputType } from '@/app/elements/Input';
import { yup } from '@climbingtopos/schemas';
import { popupError } from '@/app/helpers/alerts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export interface LoginForm {
  email: string;
  password: string;
}

const LoginFormSchema = yup
  .object({
    email: yup.string().required('Required'), // email("Not an email address").
    password: yup.string().required('Required'),
  })
  .required();

const LoginContent = ({ signIn }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(LoginFormSchema),
  });

  const formOnSubmit: SubmitHandler<LoginForm> = async (value: LoginForm) => {
    const result = await signIn(value.email, value.password);
    if (result?.error) {
      popupError(result.error);
      return;
    }
    const redirect = searchParams.get('redirect');
    const path =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/profile';
    router.replace(path);
  };

  return (
    <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={AutoComplete.on}>
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        {...register('password')}
        error={errors.password?.message}
        type={InputType.Password}
      />
      <hr />
      <div className="level">
        <Link href="/reset-password">Forgot Password?</Link>
        <Button
          color={Color.isPrimary}
          type={ButtonType.Submit}
          loading={isAuthenticating}
        >
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginContent;
