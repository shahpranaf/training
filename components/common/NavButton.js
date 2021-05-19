import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import * as NavButtonStyles from './css/NavButton.module.css'

function NavButton(props) {
  return (
    <Link href={props.path}>
      <div
        className={`${NavButtonStyles.navButton} ${
          props.router.pathname === props.path ? 'active' : ''
        }`}
      >
        <div className="Icon">{props.icon}</div>
        <span className="Label">{props.label}</span>
      </div>
    </Link>
  );
}

export default withRouter(NavButton);
