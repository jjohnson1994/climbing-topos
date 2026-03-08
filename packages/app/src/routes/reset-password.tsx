import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button, { ButtonType, Color } from '@/elements/Button'
import Form, { AutoComplete } from '@/elements/Form'
import Input from '@/elements/Input'
import { yup } from '@climbingtopos/schemas'
import { popupError } from '@/helpers/alerts'
import { useState } from 'react'
import { postFn as requestPasswordResetFn } from '@/data/actions/user/password-reset/request'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

interface ResetPasswordForm {
  email: string
}

const ResetPasswordSchema = yup
  .object({
    email: yup.string().email('Not an email address').required('Required'),
  })
  .required()

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(ResetPasswordSchema),
  })

  const formOnSubmit: SubmitHandler<ResetPasswordForm> = async (value) => {
    setIsLoading(true)
    const result = await requestPasswordResetFn({ data: { email: value.email } })
    setIsLoading(false)

    if (result?.error) {
      popupError(result.error)
      return
    }

    navigate({
      to: '/reset-password/confirm',
      search: { email: value.email.toLowerCase().trim() },
    })
  }

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Reset Password</h1>
        <p>Enter your email address and we&apos;ll send you a reset code.</p>
        <br />
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.on}
        >
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
  )
}
