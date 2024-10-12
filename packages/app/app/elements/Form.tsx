import { FormEventHandler, FunctionComponent, PropsWithChildren } from 'react';

export enum AutoComplete {
  on = 'on',
  off = 'off',
}

interface FormProps extends PropsWithChildren {
  autoComplete: AutoComplete;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form: FunctionComponent<FormProps> = ({
  children,
  onSubmit,
  autoComplete,
}) => (
  <form onSubmit={onSubmit} autoComplete={autoComplete}>
    {children}
  </form>
);

export default Form;
