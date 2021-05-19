import { useState, React } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Formik, Field } from 'formik';
import {
  FormControl, Button, Row, Col, InputGroup, Alert, FormLabel,
} from 'react-bootstrap';
import * as registerStyles from '../styles/register/register.module.css'
import AlertBox from '../components/utilities/AlertBox';
import { registerUser } from '../redux/register/slices/RegisterSlice';
import registerSchema from '../redux/register/schema/RegisterSchema';

export default function register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [registerAlert, setRegisterAlert] = useState(false);
  const [registerAlertHeader, setRegisterAlertHeader] = useState('');
  const [registerAlertMessage, setRegisterAlertMessage] = useState('');
  const [registerAlertType, setRegisterAlertType] = useState('');

  const toggleRegisterAlert = (index) => {
    setRegisterAlert(index);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function redirectTo() {
    router.back();
  }
  return (
    <div className={registerStyles.registerWrapper}>
      <div className={registerStyles.registerInner}>
        <Formik
          initialValues={{
            email: '', password: '', firstName: '', lastName: '', roleName: '',
          }}
          validationSchema={registerSchema}
          validateOnBlur
          onSubmit={(values, { setSubmitting }) => {
            dispatch(registerUser(values))
              .then((response) => {
                if (response && response.status == 201 && response.statusText == 'Created') {
                  router.push({
                    pathname: '/login',
                    query: { success: true },
                  });
                } else {
                  setRegisterAlertHeader('Error');
                  setRegisterAlertMessage(response.data.message);
                  setRegisterAlertType('danger');
                  setRegisterAlert(true);
                }

                setTimeout(() => {
                  setSubmitting(false);
                }, 400);
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
              <h3>Sign Up</h3>

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
                <InputGroup className="mb-3">
                  <FormControl
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    aria-label="First Name"
                    aria-describedby="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <FormControl
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    aria-label="Last Name"
                    aria-describedby="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                      Role
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    disabled
                    type="text"
                    placeholder="Select Role"
                    aria-label="Role Name"
                    aria-describedby="roleName"
                    value={capitalizeFirstLetter(values.roleName)}
                    onChange={handleChange}
                  />

                </InputGroup>
                {errors.roleName && touched.roleName && (<Alert key={errors.roleName} variant="danger">{errors.roleName}</Alert>)}
                <InputGroup className="mb-3">
                  <Col>
                    <FormLabel>
                      <Field type="radio" label="Instructor" name="roleName" value="instructor" />
                      Instructor
                    </FormLabel>
                  </Col>
                  <Col>
                    <FormLabel>
                      <Field type="radio" label="Instructor" name="roleName" value="student" />
                      Student
                    </FormLabel>
                  </Col>
                </InputGroup>
                <div className="alert-box">
                  {registerAlert
                            && (
                            <AlertBox
                              show={registerAlert}
                              type={registerAlertType}
                              dismissible
                              header={registerAlertHeader}
                              message={registerAlertMessage}
                              toggleShowAlert={toggleRegisterAlert}
                            />
                            )}
                </div>
                <div>
                  <Row>
                    <Col><Button variant="primary" type="submit" disabled={isSubmitting} block>Register</Button></Col>
                    <Col><Button variant="secondary" onClick={() => redirectTo()} block>Cancel</Button></Col>
                  </Row>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
