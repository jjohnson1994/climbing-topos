import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../../elements/Button";
import Form, { AutoComplete } from "../../elements/Form";
import Input, { InputType } from "../../elements/Input";
import { yup } from "core/schemas";
import { popupError } from "../../helpers/alerts";
import { Link, useHistory, useLocation } from "react-router-dom";
import useUser from "../../api/user";

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
  const history = useHistory();
  const { search } = useLocation();
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
      const searchParams = new URLSearchParams(search);
      const redirect = searchParams.get("redirect");
      const path = redirect ? redirect : "/profile";
      history.replace(path);
    } catch (error: any) {
      if (error.code === "UserNotConfirmedException") {
        history.replace("/signup-confirm", { username: value.email });
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
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isAuthenticating}
          >
            Login
          </Button>
        </Form>
        <Link to="/reset-password">Forgot Password?</Link>
      </div>
    </section>
  );
};

export default Login;
