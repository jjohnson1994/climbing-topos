'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, { ButtonType, Color, Style } from '@/app/elements/Button';
import Form, { AutoComplete } from '@/app/elements/Form';
import Input from '@/app/elements/Input';
import { yup } from '@climbingtopos/schemas';
import { popupError, popupSuccess } from '@/app/helpers/alerts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';

export interface SignupConfirmForm {
  confirmationCode: string;
}

const SignupFormConfirmSchema = yup
  .object({
    confirmationCode: yup.string().required('Required'),
  })
  .required();

function SignupConfirmContent({
  confirmSignUp,
  requestVerificationCode,
  verificationCodeExpiration: initialVerificationCodeExpiration,
  email,
}: {
  email: string;
  requestVerificationCode: () => void;
  verificationCodeExpiration: string;
  confirmSignUp: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [verificationCodeExpiration, setVerificationCodeExpiration] = useState(
    initialVerificationCodeExpiration,
  );
  const [verificationError, setVerificationError] = useState();
  const [isRequestNewDisabled, setIsRequestNewDisabled] = useState(true);

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
      await popupSuccess('Account Confirmed!');

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

  let timeout;

  useEffect(() => {
    setIsRequestNewDisabled(true);
    const now = DateTime.utc().toMillis();
    const disabledUntil = DateTime.fromISO(verificationCodeExpiration, {
      setZone: true,
    })
      .minus({ minutes: 14 })
      .toMillis();

    const ms = disabledUntil - now;

    timeout = setTimeout(() => {
      setIsRequestNewDisabled(false);
    }, ms);
  }, [verificationCodeExpiration]);

  const doRequestNewCode = async () => {
    const newExpirationTime = await requestVerificationCode();
    setVerificationCodeExpiration(newExpirationTime);
    popupSuccess('New Verification Code Sent');
  };

  return (
    <section className="section">
      <div className="container box">
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
          <div className="buttons">
            <div className="buttons">
              <Button
                {...(isRequestNewDisabled && { icon: 'fas fa-hourglass-half' })}
                disabled={isRequestNewDisabled}
                onClick={doRequestNewCode}
                type={ButtonType.Button}
                loading={isLoading}
              >
                Request New Code
              </Button>
              <Button
                type={ButtonType.Submit}
                color={Color.isPrimary}
                loading={isLoading}
              >
                Verify
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </section>
  );
}

export default SignupConfirmContent;
