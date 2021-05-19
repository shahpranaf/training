import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Dropdown, DropdownButton
} from 'react-bootstrap';
import * as HeaderStyles from './css/Header.module.css';
import NavBar from './NavBar';
import navLinks from './settings/NavLinks';
import { logoutUser } from '../../redux/login/slices/LoginSlice';

function Header() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const navLinksList = navLinks.filter((value) => {
    if (value.role == user.role) {
      return value;
    } if (value.role == 'both') {
      return value;
    }
  });

  function logout() {
    router.push('/login');
    dispatch(logoutUser());
  }

  return (
    <Container className={HeaderStyles.headerContainerFluid} fluid>
      <div className={HeaderStyles.header}>
        <NavBar navLinks={navLinksList} user={user} />
        <div>
          <DropdownButton id={HeaderStyles.dropdownMainMenu} title={`Hi ${user.firstName}`}>
            <Link href="/changepassword" passHref>
              <Dropdown.Item>Change Password</Dropdown.Item>
            </Link>
            <Link href="/login" passHref>
              <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
            </Link>
          </DropdownButton>
        </div>
      </div>
    </Container>
  );
}

export default Header;
