import { FormEventHandler, FunctionComponent } from "react";

export enum AutoComplete {
  on = "on",
  off = "off",
}

interface FormProps {
  autoComplete: AutoComplete;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form: FunctionComponent<FormProps> = ({ children, onSubmit, autoComplete }) => (
  <form onSubmit={onSubmit} autoComplete={ autoComplete }>
    {children}
  </form>
);

export default Form;
