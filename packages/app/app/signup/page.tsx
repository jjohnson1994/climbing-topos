'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonType, Color } from '@/app/elements/Button';
import Form, { AutoComplete } from '@/app/elements/Form';
import Input, { InputType } from '@/app/elements/Input';
import { yup } from '@climbingtopos/schemas';
import { popupError } from '@/app/helpers/alerts';
import { useState } from 'react';
import { post as signUp } from '@/app/data/actions/pending-user/post';
import { useRouter } from 'next/navigation';

export interface SignupForm {
  email: string;
  password: string;
}

const SignupFormSchema = yup
  .object({
    email: yup.string().email('Not an email address').required('Required'),
    password: yup.string().required('Required').min(8),
  })
  .required();

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(SignupFormSchema),
  });

  const formOnSubmit: SubmitHandler<SignupForm> = async (value: SignupForm) => {
    setIsLoading(true);

    try {
      await signUp(value.email, value.password);

      const url = '/signup-confirm';
      router.replace(url);
    } catch (error: any) {
      // Display the actual error message (includes rate limit info)
      const errorMessage = error?.message || 'Something has gone wrong, try again';
      popupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Sign up</h1>
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.on}
        >
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
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Sign up
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default Signup;
