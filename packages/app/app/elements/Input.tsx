import { ChangeEventHandler, FocusEventHandler, ForwardedRef, forwardRef, FunctionComponent } from 'react'

export const enum InputType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
  Password = 'password',
  URL = 'url',
  Color = 'color',
  File = 'file',
}

interface InputProps {
  label?: string
  placeholder?: string
  type?: InputType
  addOnRight?: any
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
  name: string
  error?: string
}

const Input: FunctionComponent<InputProps> = forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
  const getFieldClassNames = (): string => {
    const classNames = ['field']

    if (props.addOnRight) {
      classNames.push('has-addons')
    }

    return classNames.join(' ')
  }

  const getInputClassNames = (): string => {
    const classNames= ['input']
    return classNames.join(' ')
  }

  return (
    <div className="field">
      { props.label && (
        <label className="label" htmlFor={ props.name }>{ props.label }</label>
      )}
      <div className={ getFieldClassNames() }>
        <div className="control is-expanded">
          <input
            className={ getInputClassNames() }
            type={ props.type || 'text' }
            ref={ ref }
            onChange={ props.onChange }
            onBlur={ props.onBlur }
            name={ props.name }
            id={ props.name }
            {
              ...(props.placeholder && {
                placeholder: props.placeholder
              })
            }
          />
        </div>
        { props.addOnRight && (
          props.addOnRight
        )}
      </div>
      <p className="help is-danger">{ props.error }</p>
    </div>
  )
})

export default Input
