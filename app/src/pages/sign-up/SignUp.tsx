import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "yup-phone";
import { UserRegisterForm } from "../../../../core/types";
import { auth } from '../../api';
import { popupError, popupSuccess } from "../../helpers/alerts";

const schema = yup.object().shape({
  username: yup.string().required(),
  givenName: yup.string().required(),
  familyName: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().phone().required(),
  birthdate: yup.string().required(),
  password: yup.string().required().min(6)
});

function SignUp() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm<UserRegisterForm>({
    resolver: yupResolver(schema)
  });

  const formOnSubmit = handleSubmit(async (data: UserRegisterForm) => {
    setLoading(true);

    try{
      await auth.signUp(data);
      await popupSuccess(
        "Great! Your account has been created",
        () => {
          history.push("/profile");
        }
      );
    } catch(error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  });

  const handleError = (error: any) => {
    console.error("Error in sign up", error);
    popupError("Somethings gone wrong... sorry, that's never happened before");
    switch(error.code) {
      case "UsernameExistsException":
        break;
      case "InvalidParameterException":
        break;
    }
  }

  return (
    <section className="section">
      <div className="container box">
        <form onSubmit={ formOnSubmit }>
          <div className="field">
            <label className="label" htmlFor="edtUsername">Username</label>
            <div className="control">
              <input
                id="edtUsername"
                name="username"
                className="input"
                type="text"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.username?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtFirstName">First Name</label>
            <div className="control">
              <input
                id="edtFirstName"
                name="givenName"
                className="input"
                type="text"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.givenName?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtLastName">Last Name</label>
            <div className="control">
              <input
                id="edtLastName"
                name="familyName"
                className="input"
                type="text"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.familyName?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtEmail">Email</label>
            <div className="control">
              <input
                id="edtEmail"
                name="email"
                className="input"
                type="email"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.email?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtPhone">Phone</label>
            <div className="control">
              <input
                id="edtPhone"
                name="phoneNumber"
                className="input"
                type="tel"
                ref={ register }
              />
            </div>
            <p className="help is-danger">{ errors.phoneNumber?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtDob">Date of Birth</label>
            <div className="control">
              <input
                id="edtDob"
                name="birthdate"
                className="input"
                type="date"
                ref={ register({ required: true }) }
              />
            </div>
            <p className="help is-danger">{ errors.birthdate?.message }</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="edtPassword">Password</label>
            <div className="control">
              <input
                id="edtPassword"
                name="password"
                className="input"
                type="password"
                ref={ register({ required: true }) }
              />
            </div>
            <p className="help is-danger">{ errors.password?.message }</p>
          </div>

          <div className="field">
            <div className="field is-flex is-justified-end">
              <div className="control">
                <button
                  className="button is-primary {loading && 'is-loading'}"
                  disabled={ loading }
                  type="submit"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
