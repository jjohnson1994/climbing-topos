import { FunctionComponent } from "react";

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

interface MessageProps {
  header?: string;
  color: Color;
  children: any;
}

const Message: FunctionComponent<MessageProps> = (props: MessageProps) => {
  const getColor = (): Color | undefined => {
    return props.color;
  }

  const getClasses = (): string => {
    const color: Color | undefined = getColor();

    return `message ${color ? color : ''}`.trim();
  }

  const classes = getClasses();

  return (
    <article className={ classes } >
      { props.header && (
        <div className="message-header">
          <p>{ props.header }</p>
        </div>
      )}
      <div className="message-body">
        { props.children }
      </div>
    </article>
  )
}

export default Message
