import React from "react";

interface Props {
  visible: boolean;
  title: string;
  btnConfirmOnClick: Function;
  btnCancelOnClick: Function;
  btnCancelText?: string;
  btnConfirmText?: string;
  children: JSX.Element[];
}

function Modal({
  visible,
  title,
  btnCancelOnClick,
  btnConfirmOnClick,
  btnCancelText = "Cancel",
  btnConfirmText = "Confirm",
  children
}: Props) {
  return (
    <div className={ `modal ${ visible ? "is-active" : "" }` } >
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{ title }</p>
        </header>
        <section className="modal-card-body">
          { children }
        </section>
        <footer className="modal-card-foot is-flex-direction-row is-justify-content-flex-end">
          <div className="field is-grouped">
            <p className="control">
              <button
                className="button"
                onClick={ () => btnCancelOnClick() }
              >
                { btnCancelText }
              </button>
            </p>
            <p className="control">
              <button
                className="button is-primary"
                onClick={ () => btnConfirmOnClick() }
              >
                <span className="icon">
                  <i className="fas fa-check"></i>
                </span>
                <span>{ btnConfirmText }</span>
              </button>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Modal
