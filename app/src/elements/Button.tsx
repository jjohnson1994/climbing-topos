import { ForwardedRef, forwardRef, FunctionComponent } from "react";

export const enum ButtonType {
  Submit = "submit",
}

export const enum Color {
  isLight = "is-light",
  isDark = "is-dark ",
  isBlack = "is-black",
  isText = "is-text",
  isGhost = "is-ghost",
  isPrimary = "is-primary",
  isLink = "is-link",
  isInfo = "is-info",
  isSuccess = "is-success",
  isWarning = "is-warning",
  isDanger = "is-danger ",
}

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: any;
  color?: Color;
  icon?: string;
  type?: ButtonType;
  loading?: boolean;
}

const Button: FunctionComponent<ButtonProps> = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const getColor = (): Color | undefined => {
      return props.color;
    };

    const getClasses = (): string => {
      const color: Color | undefined = getColor();

      return `button ${color ? color : ""} ${props.loading ? 'is-loading' : ''}`.trim();
    };

    const classes = getClasses();

    return (
      <button
        className={classes}
        ref={ref}
        onClick={(e) => props.onClick?.(e)}
        {...(props.type && {
          type: props.type,
        })}
      >
        {props.icon && (
          <span className="icon" data-testid="iconWrapper">
            <i className={props.icon} data-testid="icon" />
          </span>
        )}
        {props.children && <span data-testid="children">{props.children}</span>}
      </button>
    );
  }
);

export default Button;
