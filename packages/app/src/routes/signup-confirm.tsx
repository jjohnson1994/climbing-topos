import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import Button, { ButtonType, Color } from '@/elements/Button'
import Form, { AutoComplete } from '@/elements/Form'
import Input from '@/elements/Input'
import { yup } from '@climbingtopos/schemas'
import { popupError, popupSuccess } from '@/helpers/alerts'
import { DateTime } from 'luxon'
import { getFn as getVerificationCodeExpirationFn } from '@/data/actions/pending-user/verification-code-timeout/get'
import { getFn as requestVerificationCodeFn } from '@/data/actions/pending-user/confirmation-code/get'
import { postFn as confirmSignUpFn } from '@/data/actions/user/verify/post'
import { getAuthUser } from '@/lib/auth'
import { logError } from '@/lib/log'

export const Route = createFileRoute('/signup-confirm')({
  loader: async () => {
    try {
      const user = await getAuthUser()

      if (!user) {
        throw redirect({ to: '/login' })
      }

      const verificationCodeExpiration = await getVerificationCodeExpirationFn()

      return { verificationCodeExpiration, email: user.properties.email }
    } catch (err) {
      logError('loader:signup-confirm', err)
      throw err
    }
  },
  component: SignupConfirmPage,
})

interface SignupConfirmForm {
  confirmationCode: string
}

const SignupFormConfirmSchema = yup
  .object({
    confirmationCode: yup.string().required('Required'),
  })
  .required()

function SignupConfirmPage() {
  const { verificationCodeExpiration: initialExpiration, email } =
    Route.useLoaderData()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCodeExpiration, setVerificationCodeExpiration] = useState(
    initialExpiration,
  )
  const [verificationError, setVerificationError] = useState<string>()
  const [isRequestNewDisabled, setIsRequestNewDisabled] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupConfirmForm>({
    resolver: yupResolver(SignupFormConfirmSchema),
  })

  const formOnSubmit: SubmitHandler<SignupConfirmForm> = async (value) => {
    setIsLoading(true)
    const result = await confirmSignUpFn({
      data: { email, verificationCode: value.confirmationCode },
    })
    setIsLoading(false)

    if (result?.error) {
      setVerificationError(result.error)
      return
    }

    await popupSuccess('Account Confirmed!')
    navigate({ to: '/profile' })
  }

  useEffect(() => {
    setIsRequestNewDisabled(true)
    const now = DateTime.utc().toMillis()
    const disabledUntil = DateTime.fromISO(verificationCodeExpiration ?? '', {
      setZone: true,
    })
      .minus({ minutes: 14 })
      .toMillis()

    const ms = disabledUntil - now

    const timeout = setTimeout(() => {
      setIsRequestNewDisabled(false)
    }, ms)

    return () => clearTimeout(timeout)
  }, [verificationCodeExpiration])

  const doRequestNewCode = async () => {
    const result = await requestVerificationCodeFn()

    if (result?.error) {
      popupError(result.error)
      return
    }

    setVerificationCodeExpiration(result.data ?? null)
    popupSuccess('New Verification Code Sent')
  }

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
        </Form>
      </div>
    </section>
  )
}
