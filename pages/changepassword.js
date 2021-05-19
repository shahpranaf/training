import {
  FormControl, Button, InputGroup, Alert, Spinner, FormLabel,
} from 'react-bootstrap';
import { Formik } from 'formik';
import {
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { React, useState ,useEffect } from 'react';
import { useRouter } from 'next/router';
import * as changepasswordStyles from '../styles/changepassword.module.css';
import { changeUserPassword } from '../redux/login/slices/LoginSlice';
import AlertBox from '../components/utilities/AlertBox';
import LoadingOverlay from '../components/utilities/overlay/LoadingOverlay';

export default function changepassword() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state) => state.user);
  const userEmail = user.email;

  const [showAlert, setShowAlert] = useState(false);
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [checkAuth,setCheckAuth] = useState(false)

  const toggleShowAlert = (index) => {
    setShowAlert(index);
  };

  useEffect(() => {
    if (user && user.accessToken == null){
      router.push({
        pathname: '/login',
        query: { authenticated: 0 },
      });
    }else if(user && user.accessToken){
      setCheckAuth(true)
    }
  }, []);

  function setAlertObject(header,message,type,toggle){
    setHeader(header);
    setMessage(message);
    setType(type);
    setAlert(toggle);
  }

  return (
    <div className={changepasswordStyles.changePasswordContent}>
      {!checkAuth && <LoadingOverlay/>}
      <div className={changepasswordStyles.changePasswordHeaderTitle}>
        <h4><b>Change Password</b></h4>
      </div>
      <Formik
        enableReinitialize
        initialValues={{ oldPass: '', newPass: '' }}
        validate={(values) => {
          const errors = {};
          if (values.oldPass == values.newPass) {
            errors.newPass = 'New Password should not be the same with Old Password';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(changeUserPassword(values, userEmail))
            .then((response) => {
              if (response && response.status == 201 && response.statusText == 'Created') {
                setAlertObject('Password Changed Successfully',response.data.message,'success',true)
                setSubmitting(false);
              } else if (response && response.status == 400 && response.statusText == 'Bad Request') {
                setAlertObject('An Error Occured',response.data.message,'danger',true)
                setSubmitting(false);
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
            <FormLabel>Old Password</FormLabel>
            <InputGroup className="mb-3">
              <FormControl
                name="oldPass"
                type="password"
                placeholder="Old Password"
                aria-label="Old Password"
                aria-describedby="oldPass"
                value={values.oldPass}
                onChange={handleChange}
              />
            </InputGroup>
            {errors.oldPass && touched.oldPass && (<Alert key={errors.oldPass} variant="danger">{errors.oldPass}</Alert>)}
            <FormLabel>New Password</FormLabel>
            <InputGroup className="mb-3">
              <FormControl
                name="newPass"
                type="password"
                placeholder="New Password"
                aria-label="New Password"
                aria-describedby="newPass"
                value={values.newPass}
                onChange={handleChange}
              />
            </InputGroup>
            {errors.newPass && touched.newPass && (<Alert key={errors.newPass} variant="danger">{errors.newPass}</Alert>)}
            <div className={`${changepasswordStyles.buttonContent} mb-3`}>
              {isSubmitting ? (
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  <FontAwesomeIcon icon={faSave} />
                  {' '}
                  Save
                </Button>
              )}
            </div>
            <div className="alert-box">
              {showAlert && <AlertBox show={showAlert} type={type} dismissible header={header} message={message} toggleShowAlert={toggleShowAlert} />}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
