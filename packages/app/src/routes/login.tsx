import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import Button, { ButtonType, Color } from '@/elements/Button'
import Form, { AutoComplete } from '@/elements/Form'
import Input, { InputType } from '@/elements/Input'
import { yup } from '@climbingtopos/schemas'
import { popupError } from '@/helpers/alerts'
import { signInFn } from '@/data/actions/user'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

interface LoginForm {
  email: string
  password: string
}

const LoginFormSchema = yup
  .object({
    email: yup.string().required('Required'),
    password: yup.string().required('Required'),
  })
  .required()

function LoginPage() {
  const navigate = useNavigate()
  const search = Route.useSearch() as { redirect?: string }
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(LoginFormSchema),
  })

  const formOnSubmit: SubmitHandler<LoginForm> = async (value: LoginForm) => {
    setIsAuthenticating(true)
    const result = await signInFn({ data: { email: value.email, password: value.password } })
    setIsAuthenticating(false)

    if (result?.error) {
      popupError(result.error)
      return
    }

    const redirect = search?.redirect
    const path =
      redirect && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/profile'

    navigate({ to: path })
  }

  return (
    <section className="section">
      <div className="container box">
        <h1 className="title">Login</h1>
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
            <Link to="/reset-password">Forgot Password?</Link>
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={isAuthenticating}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
      <div className="container">
        <div className="is-flex is-justify-content-center is-align-items-center">
          Don&apos;t have an account yet?
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </section>
  )
}
