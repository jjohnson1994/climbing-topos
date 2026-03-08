import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import Button, { ButtonType, Color } from '@/elements/Button'
import Form, { AutoComplete } from '@/elements/Form'
import Input, { InputType } from '@/elements/Input'
import { yup } from '@climbingtopos/schemas'
import { popupError } from '@/helpers/alerts'
import { postFn as signUpFn } from '@/data/actions/pending-user/post'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

interface SignupForm {
  email: string
  password: string
}

const SignupFormSchema = yup
  .object({
    email: yup.string().email('Not an email address').required('Required'),
    password: yup.string().required('Required').min(8),
  })
  .required()

function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(SignupFormSchema),
  })

  const formOnSubmit: SubmitHandler<SignupForm> = async (value: SignupForm) => {
    setIsLoading(true)
    const result = await signUpFn({ data: { email: value.email, password: value.password } })
    setIsLoading(false)

    if (result?.error) {
      popupError(result.error)
      return
    }

    navigate({ to: '/signup-confirm' })
  }

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
  )
}
