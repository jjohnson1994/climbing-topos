"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "@/app/elements/Button";
import Form, {AutoComplete} from "@/app/elements/Form";
import Input from "@/app/elements/Input";
import { yup } from "@climbingtopos/schemas";
import { popupError, popupSuccess } from "@/app/helpers/alerts";
import { useSearchParams } from 'next/navigation'
import { useState } from "react";
import useUser from "@/app/api/user";
import { useRouter } from 'next/navigation'

export interface SignupConfirmForm {
  confirmationCode: string;
}

export const SignupFormConfirmSchema = yup
  .object({
    confirmationCode: yup.string().required("Required"),
  })
  .required();

const SignupConfirm = () => {
  const searchParams = useSearchParams();
  const {  confirmSignUp } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupConfirmForm>({
    resolver: yupResolver(SignupFormConfirmSchema),
  });

  const formOnSubmit: SubmitHandler<SignupConfirmForm> = async (value: SignupConfirmForm) => {
    setIsLoading(true);

    try {
      if (!searchParams.get('username')) {
        throw new Error("Username is not defined")
      }

      await confirmSignUp(searchParams.get('username'), value.confirmationCode)
      await popupSuccess("Confirmed!");

      router.push("/profile");
    } catch (error: any) {
      console.error(error);
      popupError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Verify Account</h1>
        <p>Hi <b>{ searchParams.get('username') }</b>, a confirmation code has been sent to your email address</p>
        <br/>
        <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={ AutoComplete.off }>
          <Input
            label="Confirmation Code"
            {...register("confirmationCode")}
            error={errors.confirmationCode?.message}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Verify
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default SignupConfirm;
