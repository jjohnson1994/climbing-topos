import { ForwardedRef, forwardRef, FunctionComponent } from 'react';

export const enum ButtonType {
  Submit = 'submit',
  Button = 'button',
}

export const enum Color {
  isLight = 'is-light',
  isDark = 'is-dark ',
  isBlack = 'is-black',
  isText = 'is-text',
  isGhost = 'is-ghost',
  isPrimary = 'is-primary',
  isLink = 'is-link',
  isInfo = 'is-info',
  isSuccess = 'is-success',
  isWarning = 'is-warning',
  isDanger = 'is-danger ',
}

export const enum Size {
  isSmall = 'is-small',
  isLarge = 'is-large',
}

export const enum Style {
  isOutlined = 'is-outlined',
}

interface ButtonProps {
  onClick?: Function;
  children?: any;
  color?: Color;
  size?: Size;
  icon?: string;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  style?: Style;
}

const Button: FunctionComponent<ButtonProps> = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const getClasses = (): string => {
      const color = props.color;
      const size = props.size;
      const style = props.style;

      return `button ${color ? color : ''} ${size ? size : ''} ${style ? style : ''} ${props.loading ? 'is-loading' : ''}`.trim();
    };

    const classes = getClasses();

    return (
      <button
        className={classes}
        ref={ref}
        {...(props.onClick && {
          onClick: (e) => props.onClick?.(e),
        })}
        {...(props.type && {
          type: props.type,
        })}
        {...(props.disabled && {
          disabled: props.disabled,
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
  },
);

export default Button;
