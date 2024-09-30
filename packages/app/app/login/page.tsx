"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "@/app/elements/Button";
import Form, { AutoComplete } from "@/app/elements/Form";
import Input, { InputType } from "@/app/elements/Input";
import { yup } from "@climbingtopos/schemas";
import { popupError } from "@/app/helpers/alerts";
import Link from "next/link"
import { useRouter } from 'next/navigation'
import useUser from "@/app/api/user";
import { useSearchParams } from 'next/navigation'

export interface LoginForm {
  email: string;
  password: string;
}

export const LoginFormSchema = yup
  .object({
    email: yup.string().required("Required"), // email("Not an email address").
    password: yup.string().required("Required"),
  })
  .required();

const Login = () => {
  const searchParams = useSearchParams();
  const router = useRouter()
  const { signIn, isAuthenticating } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(LoginFormSchema),
  });

  const formOnSubmit: SubmitHandler<LoginForm> = async (value: LoginForm) => {
    try {
      await signIn(value.email, value.password);
      const redirect = searchParams.get("redirect");
      const path = redirect ? redirect : "/profile";
      router.replace(path);
    } catch (error: any) {
      if (error.code === "UserNotConfirmedException") {
        router.replace(`/signup-confirm?${ new URLSearchParams({username: value.email}) }`);
      } else if (error.code === "UserNotFoundException") {
        popupError("Could not find a matching account");
      } else {
        popupError("Something has gone wrong, try again");
      }
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.on}
        >
          <Input
            label="Username or email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            {...register("password")}
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
      </div>
    </section>
  );
};

export default Login;
