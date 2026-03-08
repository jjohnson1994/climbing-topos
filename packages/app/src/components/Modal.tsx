import React, { PropsWithChildren } from 'react';
import { Link } from '@tanstack/react-router';
import Button from '../elements/Button';

interface Props extends PropsWithChildren {
  visible: boolean;
  title: string;
  btnConfirmOnClick: (() => void) | string;
  btnCancelOnClick: (() => void) | string;
  btnCancelText?: string;
  btnConfirmText?: string;
  confirmActionLoading?: boolean;
  hasCancelButton?: boolean;
  hasConfirmButton?: boolean;
}

function Modal({
  btnCancelOnClick,
  btnCancelText = 'Cancel',
  btnConfirmOnClick,
  btnConfirmText = 'Confirm',
  children,
  hasCancelButton,
  hasConfirmButton,
  confirmActionLoading = false,
  title,
  visible,
}: Props) {
  return (
    <div className={`modal ${visible ? 'is-active' : ''}`} role="dialog" aria-label={title} aria-modal="true">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot is-flex-direction-row is-justify-content-flex-end">
          <div className="field is-grouped">
            {hasCancelButton !== false &&
              typeof btnCancelOnClick === 'function' && (
                <p className="control">
                  <Button
                    onClick={btnCancelOnClick}
                    disabled={confirmActionLoading}
                  >
                    {btnCancelText}
                  </Button>
                </p>
              )}
            {hasCancelButton !== false &&
              typeof btnCancelOnClick === 'string' && (
                <Link to={btnCancelOnClick}>
                  <p className="control">
                    <Button disabled={confirmActionLoading}>
                      {btnCancelText}
                    </Button>
                  </p>
                </Link>
              )}
            {hasConfirmButton !== false &&
              typeof btnConfirmOnClick === 'function' && (
                <p className="control">
                  <Button
                    onClick={btnConfirmOnClick}
                    loading={confirmActionLoading}
                  >
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                    <span>{btnConfirmText}</span>
                  </Button>
                </p>
              )}
            {hasConfirmButton !== false &&
              typeof btnConfirmOnClick === 'string' && (
                <Link to={btnConfirmOnClick}>
                  <p className="control">
                    <Button loading={confirmActionLoading}>
                      <span className="icon">
                        <i className="fas fa-check"></i>
                      </span>
                      <span>{btnConfirmText}</span>
                    </Button>
                  </p>
                </Link>
              )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Modal;
