import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import * as NavLinkStyles from './css/NavLink.module.css';
import { Nav } from 'react-bootstrap';

function NavLink(props) {
  return (
    <Link href={props.path} as={props.as} passHref>
      <Nav.Link className={NavLinkStyles.navLink}>{props.label}</Nav.Link>
    </Link>
  );
}
export default withRouter(NavLink);
