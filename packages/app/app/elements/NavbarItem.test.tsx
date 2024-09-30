import { render, screen } from "@testing-library/react"
import NavbarItem from "./NavbarItem"

describe('NavbarItem', () => {
  it('Has `navbar-item` className', () => {
    render(<NavbarItem> </NavbarItem>)

    expect(screen.getByTestId('navbarItem')).toHaveClass('navbar-item')
  })

  it('Renders children', () => {
    render(
      <NavbarItem>
        <p data-testid="child">Hi</p>
        <p data-testid="childB">Hi</p>
      </NavbarItem>
    )

    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.getByTestId('childB')).toBeTruthy();
  })
})
