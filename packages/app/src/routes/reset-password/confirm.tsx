import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button, { ButtonType, Color } from '@/elements/Button'
import Form, { AutoComplete } from '@/elements/Form'
import Input, { InputType } from '@/elements/Input'
import { yup } from '@climbingtopos/schemas'
import { popupError, popupSuccess } from '@/helpers/alerts'
import { useState } from 'react'
import { postFn as confirmPasswordResetFn } from '@/data/actions/user/password-reset/confirm'

export const Route = createFileRoute('/reset-password/confirm')({
  validateSearch: (search: Record<string, unknown>): { email?: string } => ({
    email: search.email as string | undefined,
  }),
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.search)
    const email = params.get('email')

    if (!email) {
      throw redirect({ to: '/reset-password' })
    }

    return { email }
  },
  component: ResetPasswordConfirmPage,
})

interface ResetPasswordConfirmForm {
  code: string
  password: string
  confirmPassword: string
}

const ResetPasswordConfirmSchema = yup
  .object({
    code: yup.string().required('Required'),
    password: yup
      .string()
      .min(8, 'Must be at least 8 characters')
      .required('Required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Required'),
  })
  .required()

function ResetPasswordConfirmPage() {
  const { email } = Route.useLoaderData()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordConfirmForm>({
    resolver: yupResolver(ResetPasswordConfirmSchema),
  })

  const formOnSubmit: SubmitHandler<ResetPasswordConfirmForm> = async (
    value,
  ) => {
    setIsLoading(true)
    const result = await confirmPasswordResetFn({
      data: { email, code: value.code, newPassword: value.password },
    })
    setIsLoading(false)

    if (result?.error) {
      popupError(result.error)
      return
    }

    await popupSuccess(
      'Password reset successfully! Please log in with your new password.',
    )
    navigate({ to: '/login' })
  }

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Reset Password</h1>
        <p>
          A reset code has been sent to <b>{email}</b> if an account exists for
          that address.
        </p>
        <br />
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.off}
        >
          <Input
            label="Reset Code"
            {...register('code')}
            error={errors.code?.message}
          />
          <Input
            label="New Password"
            {...register('password')}
            error={errors.password?.message}
            type={InputType.Password}
          />
          <Input
            label="Confirm New Password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            type={InputType.Password}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    </section>
  )
}
