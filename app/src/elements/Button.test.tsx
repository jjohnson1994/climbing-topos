import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Button, { Color } from './Button'

describe('Button', () => {
  it('Renders `children`', () => {
    render(
      <Button>
        Button Text
      </Button>
    );

    expect(screen.getByRole('button')).toHaveTextContent(/^Button Text$/);
  })

  it('Can Render `icon` and not `children`', () => {
    render(
      <Button icon="an icon" />
    );

    expect(screen.queryByTestId('children')).toBeNull();
    expect(screen.queryByTestId('icon')).toHaveClass('an icon');
  })

  it('Can Render `children` and not `icon`', () => {
    render(
      <Button> Button </Button>
    );

    expect(screen.queryByTestId('icon')).toBeNull();
    expect(screen.queryByTestId('children')).toBeTruthy()
  })

  it('Renders an `icon`', () => {
    const iconClass = 'an icon'
    render(
      <Button icon={ iconClass }>
        Button Text
      </Button>
    );

    expect(screen.getByTestId('icon')).toHaveClass(iconClass);
  })

  it('Does not Render an `icon` is Prop is Null', () => {
    render(
      <Button>
        Button Text
      </Button>
    );

    expect(screen.queryByTestId('icon')).toBeNull();
  });

  it('Calls onClick When Clicked', () => {
    const fn =jest.fn();

    render(
      <Button onClick={ fn }>
        Button Text
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent(button, new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    }));

    expect(fn).toHaveBeenCalled();
  });

  it('Adds `color` prop to `className`', () => {
    render(
      <Button color={ Color.isWarning }>
        Button Text
      </Button>
    );

    const button = screen.getByRole('button');

    expect(button).toHaveClass('is-warning')
  });

  it ('Had no `color` by default', () => {
    render(
      <Button>
        Button Text
      </Button>
    );

    expect(screen.getByRole('button').className).toBe('button')
  });
})
