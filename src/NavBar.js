import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import {Link} from 'react-router-dom';
import './NavBar.css'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Navbar
      color="light"
      expand="md"
      light
    >
      <NavbarBrand to="/">
        End of Day Modeler
      </NavbarBrand>
      <NavbarToggler onClick={function noRefCheck(){setIsOpen(open=>!open);}} />
      <Collapse navbar isOpen={isOpen}>
      <Nav className='NavBar'>
        <NavItem>
          <NavLink>
            <Link to="/">
              Home
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <nbsp> </nbsp>
            <nbsp> </nbsp>
            <Link to="/NASDX">
              NASDX
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <nbsp> </nbsp>
            <nbsp> </nbsp>
            <Link to="/VASGX">
              VASGX
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <nbsp> </nbsp>
            <nbsp> </nbsp>
            <Link to="/BITCF">
              BITCF
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <nbsp> </nbsp>
            <nbsp> </nbsp>
            <Link to="/RRGB">
              RRGB
            </Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink>
            <nbsp> </nbsp>
            <nbsp> </nbsp>
            <Link to="/OGHCX">
              OGHCX
            </Link>
          </NavLink>
        </NavItem>
      </Nav>
      </Collapse>
    </Navbar>
  )
};

export default NavBar;