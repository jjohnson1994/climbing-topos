import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { auth } from '../../api';
import { popupError } from "../../helpers/alerts";
import { UserRegisterConfirmationForm } from "../../../../core/types";

function SignUpConfirm() {
  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const { register, handleSubmit, errors } = useForm<UserRegisterConfirmationForm>();

  const handleError = (error: any) => {
    console.error('Error confirming account', error);
    popupError ("Oh dear"); 
    switch (error.code) {
      
    }
  };

  const onFormSubmit = handleSubmit(async (data: UserRegisterConfirmationForm) => {
    try {
      setLoading(true);
      await auth.signUpConfirm("jj", data.confirmationCode);
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
            <label className="label" htmlFor="edtConfirmationCode">Confirmation Code</label>
            <div className="control">
              <input
                className="input"
                id="edtConfirmationCode"
                type="text"
                name="confirmationCode"
                ref={ register({ required: 'Required' }) }
              />
            </div>
            <p className="help is-danger">{ errors.confirmationCode?.message }</p>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button
                className="button is-primary {logginLoading && 'is-loading'}"
                disabled={ loading }
                type="submit"
              >
                <span>Confirm Account</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignUpConfirm;
