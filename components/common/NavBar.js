import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import * as NavBarStyles from './css/NavBar.module.css';
import NavLink from './NavLink';

function NavBar(props) {
  return (
    <div className={NavBarStyles.navbar}>
      <Navbar bg="dark" expand="md" className={NavBarStyles.gradientBackground}>
        <FontAwesomeIcon className={NavBarStyles.navbarLogo} icon={faReact} size="2x" spin />
        <Navbar.Brand href="/">e Learning</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className={NavBarStyles.headerNavbar}>
          <Nav className="mr-auto">
            {props.navLinks.map((link) => (
              <NavLink
                key={link.path}
                path={link.path}
                as={link.as}
                label={link.label}
              />
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;
