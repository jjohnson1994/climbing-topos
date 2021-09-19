import { FunctionComponent } from "react"

export enum Color {
  isWhite = 'is-white',
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
  isDanger = 'is-danger '
}

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: any;
  color?: Color;
  icon?: string;
} 

const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const getColor = (): Color | undefined => {
    return props.color;
  }

  const getClasses = (): string => {
    const color: Color | undefined = getColor();

    return `button ${color ? color : ''}`.trim();
  }

  const classes = getClasses();

  return (
    <button className={ classes } onClick={ e => props.onClick?.(e) }>
      {
        props.icon && (
          <span className="icon" data-testid="iconWrapper">
            <i className={ props.icon } data-testid="icon"/>
          </span>
        )
      }
      {
        props.children && (
          <span data-testid="children">{ props.children }</span>
        )
      }
    </button>
  )
}

export default Button
