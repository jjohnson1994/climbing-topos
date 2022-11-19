import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../../elements/Button";
import Form, {AutoComplete} from "../../elements/Form";
import Input from "../../elements/Input";
import { yup } from "core/schemas";
import { popupError, popupSuccess } from "../../helpers/alerts";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";
import useUser from "../../api/user";

export interface SignupConfirmForm {
  confirmationCode: string;
}

export const SignupFormConfirmSchema = yup
  .object({
    confirmationCode: yup.string().required("Required"),
  })
  .required();

const SignupConfirm = () => {
  const location = useLocation<{ username?: string }>();
  const history = useHistory();
  const {  confirmSignUp } = useUser();
  const [isLoading, setIsLoading] = useState(false);

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
      if (!location.state.username) {
        throw new Error("Username is not defined")
      }

      await confirmSignUp(location.state.username, value.confirmationCode)
      await popupSuccess("Confirmed!");

      history.push("/profile");
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
        <p>Hi <b>{ location.state.username }</b>, a confirmation code has been sent to your email address</p>
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
