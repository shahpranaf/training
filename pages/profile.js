import { React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormControl, Row, Col, InputGroup, Container, Image, FormCheck, FormLabel,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import * as profileStyles from '../styles/profile.module.css'
import { getUserDetails } from '../redux/login/slices/LoginSlice';
import LoadingOverlay from '../components/utilities/overlay/LoadingOverlay';

export default function profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [checkAuth,setCheckAuth] = useState(false)

  const user = useSelector((state) => state.user);
  const lstg = window.localStorage;
  const userObj = user;
  const initialValues = {
    avatar: userObj ? userObj.avatar : '',
    email: userObj ? userObj.email : '',
    firstName: userObj ? userObj.firstName : '',
    lastName: userObj ? userObj.lastName : '',
    role: userObj ? userObj.role : '',
    verified: userObj ? userObj.isVerified : false,
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

  

  useEffect(() => {
    if (user && user.id == null) {
      if (user.accessToken == null) {
        const userAuth = lstg.getItem('ACCESS_TOKEN') || null;
        if (userAuth) {
          dispatch(getUserDetails(userAuth));
        }
      } else {
        dispatch(getUserDetails(user.accessToken));
      }
    }
  }, []);

  return (
    <div className={profileStyles.profileContent}>
      {!checkAuth && <LoadingOverlay/>}
      <div className={profileStyles.profilePicture}>
        <Image src={userObj.avatar} fluid roundedCircle />
      </div>
      <div className={profileStyles.profileHeaderTitle}>
        <h4><b>Personal Information</b></h4>
      </div>
      <div className={profileStyles.profileBody}>

        <Formik
          enableReinitialize
          initialValues={{
            firstName: initialValues.firstName, lastName: initialValues.lastName, role: initialValues.role, verfied: initialValues.verified,
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Container fluid>
                <Row>
                  <Col>
                    <FormLabel>First Name</FormLabel>
                    <InputGroup className="mb-3">
                      <FormControl
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        aria-label="First Name"
                        aria-describedby="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        readOnly
                      />
                    </InputGroup>
                  </Col>
                  <Col>
                    <FormLabel>Last Name</FormLabel>
                    <InputGroup className="mb-3">
                      <FormControl
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        aria-label="Last Name"
                        aria-describedby="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        readOnly
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormLabel>Role</FormLabel>
                    <InputGroup className="mb-3">
                      <FormControl
                        name="role"
                        type="text"
                        placeholder="Role"
                        aria-label="Role"
                        aria-describedby="role"
                        value={values.role}
                        onChange={handleChange}
                        readOnly
                      />
                    </InputGroup>
                  </Col>
                  <Col>
                    <FormLabel>Verified</FormLabel>
                    <InputGroup className="mb-3">
                      <FormCheck type="checkbox" id="verified" name="verfied" checked={values.verfied} readOnly />
                    </InputGroup>
                  </Col>
                </Row>
              </Container>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
