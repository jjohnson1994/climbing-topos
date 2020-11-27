import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { auth } from '../../api';
import {popupWarning} from "../../helpers/alerts";

type FormData = {
  username: string,
  password: string,
}

function SignIn() {
  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const { register, handleSubmit, errors } = useForm<FormData>();

  const handleError = (error: any) => {
    console.error('Error logging in', error);
    switch (error.code) {
      case "NotAuthorizedException":
        popupWarning("Incorrect Username or Password");
        break;
      case "UserNotConfirmedException":
        console.log('1');
        history.push("/sign-up-confirm");
        break;
    }
  };

  const onFormSubmit = handleSubmit(async (data: FormData) => {
    try {
      setLoading(true);
      await auth.signIn(data.username, data.password);
      history.push("/profile");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <section className="section">
      <div className="container box">
        <form onSubmit={ onFormSubmit }>
          <div className="field">
            <label className="label" htmlFor="edtUsername">Username</label>
            <div className="control">
              <input
                className="input"
                id="edtUsername"
                type="text"
                name="username"
                ref={ register({ required: 'Required' }) }
              />
            </div>
            <p className="help is-danger">{ errors.username?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtPassword">Password</label>
            <div className="control">
              <input
                className="input"
                id="edtPassword"
                type="password"
                name="password"
                ref={ register({ required: 'Required' }) }
              />
            </div>
            <p className="help is-danger">{ errors.password?.message }</p>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button
                className="button is-link is-outlined"
                disabled={ loading }
                type="submit"
              >
                <span>Forgot Password</span>
              </button>
            </div>
            <div className="control">
              <a
                className="button is-light"
                href="/sign-up"
                type="button"
              >
                <span>Sign Up</span>
              </a>
            </div>
            <div className="control">
              <button
                className="button is-primary {logginLoading && 'is-loading'}"
                disabled={ loading }
                type="submit"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
