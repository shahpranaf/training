import { Formik } from 'formik';
import {
  FormControl, Button, Row, Col, InputGroup, Alert, Spinner,
} from 'react-bootstrap';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import * as newsubjectStyles from '../../styles/subjects/newsubject.module.css';
import { addSubjectSchema } from '../../redux/subjects/schemas/AddSubjectSchema';
import { addSubject, getSubjects } from '../../redux/subjects/slices/SubjectSlice';
import AlertBox from '../../components/utilities/AlertBox';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';

export default function newsubject() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const routerQuery = router.query

  const [showAlert, setAlert] = useState(false);
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const [checkAuth,setCheckAuth] = useState(false)

  const routerObj = {
    pathName: '',
    as: '',
  };

  const toggleShowAlert = (index) => {
    setAlert(index);
  };

  function redirectTo() {
    router.back();
  }

  useEffect(() => {
    if (user && user.accessToken == null){
      router.push({
        pathname: '/login',
        query: { authenticated: 0 },
      });
    }else if (user && user.accessToken){
      if(user.role == 'student'){
        router.push({
          pathname: '/',
          query: { role: user.role },
        });
      }else{
        setCheckAuth(true)
      }
    
    }
    
  }, []);

  function setAlertObject(header,message,type,toggle){
    const responseType = {
      error: {
        objectType: 'error',
      },
      success: {
        objectType: 'success',
      },
      warning: {
        objectType: 'warning'
      }
    };

    setHeader(header);
    setMessage(message);
    setType(responseType[type].objectType);
    setAlert(toggle);
  }

  return (
    <div className={newsubjectStyles.registerSubjectWrapper}>
      <Formik
        initialValues={{ title: '' }}
        validationSchema={addSubjectSchema}
        validateOnBlur
        onSubmit={(values, { setSubmitting }) => {
          dispatch(addSubject(values, accessToken))
            .then((response) => {
              if (response && response.status == 201 && response.statusText == 'Created') {
                setAlertObject('Subject Successfully Created','Redirecting to Subject List','success',true)
                dispatch(getSubjects(accessToken));
                routerObj.pathName = '/subjects/subjectlist';
                setTimeout(() => {
                  router.push(routerObj.pathName);
                }, 1000);
              } else {
                setAlertObject('Subject Unsuccessfully Created',response.data.message,'danger',true)
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
            {!checkAuth && <LoadingOverlay/>}
            <div>
              <InputGroup className="mb-3">
                <FormControl
                  name="title"
                  type="text"
                  placeholder="Title"
                  aria-label="Title"
                  aria-describedby="title"
                  value={values.title}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors.title && touched.title && (<Alert key={errors.title} variant="danger">{errors.title}</Alert>)}
              <div>
                <Row>
                  <Col>
                    {isSubmitting
                      ? (
                        <Button variant="primary" type="submit" disabled={isSubmitting} block>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        </Button>
                      )
                      : (
                        <Button variant="primary" type="submit" disabled={isSubmitting} block>
                          Add Subject
                        </Button>
                      )}
                  </Col>
                  <Col><Button variant="secondary" onClick={() => redirectTo()} block>Cancel</Button></Col>
                </Row>
              </div>
            </div>
            <div className={newsubjectStyles.alertBox}>
              {showAlert && <AlertBox show={showAlert} type={type} dismissible header={header} message={message} toggleShowAlert={toggleShowAlert} />}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
