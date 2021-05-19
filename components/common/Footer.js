import {
  Container
} from 'react-bootstrap';
import * as FooterStyles from './css/Footer.module.css';

function Footer() {
  return (
    <Container className={FooterStyles.footerContainerFluid} fluid>
      <div className={FooterStyles.footer}>
        © 2021 Copyright: E-Learning Platform
      </div>
    </Container>
  );
}
export default Footer;
