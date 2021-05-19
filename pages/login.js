import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import {
  InputGroup, FormControl, Button, Alert,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import AlertBox from '../components/utilities/AlertBox';
import * as loginStyles from '../styles/login/login.module.css';
import { loginUser, getUserDetails } from '../redux/login/slices/LoginSlice';
import loginSchema from '../redux/login/schema/LoginSchema';



export default function login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const routerQuery = router.query;
  
  const user = useSelector((state) => state.user) || '';
  const [loginAlert, setLoginAlert] = useState(false);
  const [loginAlertHeader, setLoginAlertHeader] = useState('');
  const [loginAlertMessage, setLoginAlertMessage] = useState('');
  const [loginAlertType, setLoginAlertType] = useState('');

  const toggleLoginAlert = (index) => {
    setLoginAlert(index);
    router.push({
      pathname: router.pathname,
    }, 
    undefined, { shallow: true }
    )
  };

  useEffect(() => {
    if (user && user.accessToken){
      router.push({
        pathname: '/',
      });
    }
  }, []);

  useEffect(() => {
    if (routerQuery && routerQuery.authenticated == 0 ) {
      setLoginAlertHeader('Oops!');
      setLoginAlertMessage('You need to login first!');
      setLoginAlertType('danger');
      setLoginAlert(true);
    }
  }, []);

  return (
    <div className={loginStyles.loginWrapper}>
      <div className={loginStyles.loginInner}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          validateOnBlur
          onSubmit={(values, { setSubmitting }) => {
            dispatch(loginUser(values))
              .then((response) => {
                if (response && response.status == 201 && response.statusText == 'Created') {
                  dispatch(getUserDetails(response.data.accessToken));
                  router.push('/');
                } else {
                  setSubmitting(false);
                  setLoginAlertHeader('Login Failed!');
                  setLoginAlertMessage(response.data.message);
                  setLoginAlertType('danger');
                  setLoginAlert(true);
                }
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <h3>E Learning App</h3>
              <div>
                <InputGroup className="mb-3">
                  <FormControl
                    name="email"
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </InputGroup>
                {errors.email && touched.email && (<Alert key={errors.email} variant="danger">{errors.email}</Alert>)}
                <InputGroup className="mb-3">
                  <FormControl
                    name="password"
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </InputGroup>
                {errors.password && touched.password && (<Alert key={errors.password} variant="danger">{errors.password}</Alert>)}
                {isSubmitting ? (
                  <Button variant="primary" block><FontAwesomeIcon icon={faCircleNotch} spin>Login</FontAwesomeIcon></Button>
                ) : (
                  <Button variant="primary" type="submit" block>Login</Button>
                )}
                <div className={loginStyles.signUp}>
                  <p>
                    Dont have an account?
                    <Link href="/register" passHref>Sign up</Link>
                  </p>
                </div>
              </div>
              <div>
                {loginAlert && (
                  <AlertBox
                    show={loginAlert}
                    type={loginAlertType}
                    dismissible
                    header={loginAlertHeader}
                    message={loginAlertMessage}
                    toggleShowAlert={toggleLoginAlert}
                  />
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
