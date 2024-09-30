import {FunctionComponent} from "react"

interface NavbarProps {
  children: any;
}

const NavbarItem: FunctionComponent<NavbarProps> = (props: NavbarProps) => {
  return (
    <div className="navbar-item" data-testid="navbarItem">
      {
        props.children && (
          props.children
        )
      }
    </div>
  )
}

export default NavbarItem
