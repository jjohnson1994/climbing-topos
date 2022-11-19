import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../../elements/Button";
import Form, { AutoComplete } from "../../elements/Form";
import Input, { InputType } from "../../elements/Input";
import { yup } from "core/schemas";
import { popupError } from "../../helpers/alerts";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import useUser from "../../api/user";

export interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupFormSchema = yup
  .object({
    username: yup.string().required("Required"),
    email: yup.string().email("Not an email address").required("Required"),
    password: yup.string().required("Required").min(8),
    confirmPassword: yup
      .string()
      .required("Required")
      .test("confirmPassword", "Passwords Do Not Match", function (value) {
        const { password } = this.parent;
        return value === password;
      }),
  })
  .required();

const Signup = () => {
  const history = useHistory();
  const { signUp } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: yupResolver(SignupFormSchema),
  });

  const formOnSubmit: SubmitHandler<SignupForm> = async (value: SignupForm) => {
    setIsLoading(true);

    try {
      await signUp({
        username: value.username,
        password: value.password,
        attributes: {
          email: value.email,
        },
      });
      history.replace("/signup-confirm", { username: value.username });
    } catch (error) {
      if (error.code === "UsernameExistsException") {
        popupError("Email is already registered, try logging instead");
      } else {
        popupError("Something has gone wrong, try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Signup</h1>
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.on}
        >
          <Input
            label="Username"
            {...register("username")}
            error={errors.username?.message}
          />
          <Input
            label="Email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            type={InputType.Password}
          />
          <Input
            label="Confirm Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            type={InputType.Password}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Signup
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default Signup;
