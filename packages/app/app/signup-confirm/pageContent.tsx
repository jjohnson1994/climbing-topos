'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonType, Color } from '@/app/elements/Button';
import Form, { AutoComplete } from '@/app/elements/Form';
import Input from '@/app/elements/Input';
import { yup } from '@climbingtopos/schemas';
import { popupError, popupSuccess } from '@/app/helpers/alerts';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

export interface SignupConfirmForm {
  confirmationCode: string;
}

const SignupFormConfirmSchema = yup
  .object({
    confirmationCode: yup.string().required('Required'),
  })
  .required();

function SignupConfirmContent({ confirmSignUp, email }: { email: string }) {
  console.log({ confirmSignUp, email });
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [verificationError, setVerificationError] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupConfirmForm>({
    resolver: yupResolver(SignupFormConfirmSchema),
  });

  const formOnSubmit: SubmitHandler<SignupConfirmForm> = async (
    value: SignupConfirmForm,
  ) => {
    setIsLoading(true);

    try {
      await confirmSignUp(email, value.confirmationCode);
      await popupSuccess('Confirmed!');

      router.push('/profile');
    } catch (error: any) {
      if (error.message) {
        setVerificationError(error.message);
      } else {
        popupError('Somethings gone wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Verify Account</h1>
        <p>
          Hi <b>{email}</b>, a confirmation code has been sent to your email
          address
        </p>
        <br />
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.off}
        >
          <Input
            label="Confirmation Code"
            {...register('confirmationCode')}
            error={errors.confirmationCode?.message ?? verificationError}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Verify
          </Button>
          {verificationError === 'Verification code expired' && (
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={isLoading}
            >
              Request New Code
            </Button>
          )}
        </Form>
      </div>
    </section>
  );
}

export default SignupConfirmContent;
