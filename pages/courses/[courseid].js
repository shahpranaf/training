import {
  FormControl, Button, Row, Col, InputGroup, Alert, Spinner, Container, Table, DropdownButton, Dropdown, FormLabel,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { React ,useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { faPlus, faSave, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import * as courseidStyles from '../../styles/courses/[courseid].module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addModule, deleteModuleById, getModuleById } from '../../redux/modules/slices/ModuleSlice';
import { updateCourseById, getCourseById } from '../../redux/courses/slices/CourseSlice';
import { addSubscription } from '../../redux/subscription/slices/SubscriptionSlice';
import InformationModal from '../../components/utilities/modal/InformationModal';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';

export async function getServerSideProps(context) {
  const courseQuery = context.query;
  return {
    props: { courseQuery },
  };
}

export default function courseid(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [checkAuth,setCheckAuth] = useState(false)

  // Get data from store
  const user = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const selectedcourse = useSelector((state) => state.courses.selectedcourse)

  // Check User Role
  const userRole = user.role;
  const readOnly = userRole == 'student';

  const subscriptionList = userRole == 'student' && useSelector((state) => state.subscriptions.subscriptions);

  // Get Course ID from Server Side Props
  const courseId = props.courseQuery.id ? props.courseQuery.id : selectedcourse[0]._id;
  const [courseObj, setCourseObj] = useState();
  const [subscriptionObj, setSubscriptionObj] = useState();

  // Modal Properties
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalFooter, setModalFooter] = useState('');
  const [toggleModal, setToggleModal] = useState(false);

  const moduleList = courseObj && courseObj.modules;
  const isEnrolled = !!subscriptionObj;
  const initialValues = {
    courseName: courseObj ? courseObj.title : '',
    courseDescription: courseObj ? courseObj.description : '',
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
    if (courseId) {
      dispatch(getCourseById(courseId, accessToken))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            setCourseObj(response.data);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (subscriptionList && subscriptionList.length != 0) {
      subscriptionList.filter((data) => {
        if (data.course._id == courseId) {
          setSubscriptionObj(data);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedcourse) {
      setCourseObj(selectedcourse[0])
    }
  }, []);



  if (moduleList) {
    for (const a in moduleList) {
      dispatch(getModuleById(moduleList[a]._id, accessToken))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            _.merge(moduleList[a], response.data);
          }
        });
    }
  }

  function getUpdatedCourse(courseId){
    dispatch(getCourseById(courseId, accessToken))
    .then((response) => {
      if (response && response.status == 200 && response.statusText == 'OK') {
        setCourseObj(response.data);
      }
  });
  }

  function enrollCourse(courseId, accessToken) {
    if (courseId && userRole == 'student') {
      dispatch(addSubscription(courseId, accessToken))
        .then((response) => {
          if (response && response.status == 201 && response.statusText == 'Created') {
            setSubscriptionObj(response.data);
          }
        });
    }
  }

  function setModalObject(type,title,body,footer,toggle){
    setToggleModal(toggle);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer);
  }

  function removeModule(id, token) {
    if (id) {
      dispatch(deleteModuleById(id, token))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            dispatch(getCourseById(courseId, accessToken))
              .then((response) => {
                if (response && response.status == 200 && response.statusText == 'OK') {
                  setCourseObj(response.data);
                  setModalObject('success','Success!','Module successfully deleted.','',true)
                } else {
                  setModalObject('error','Error!','Module unsuccessfully deleted.','',true)
                }
              });
          }
        });
    }
  }

  return (
    <Container fluid>
      {!checkAuth && <LoadingOverlay/>}
      <div className={courseidStyles.courseHeaderTitle}>
        <h4><b>Course Details</b></h4>
      </div>
      <Row>
        <Col>
          <div className={`${courseidStyles.subjectDetails} mb-3`}>
            <Formik
              enableReinitialize
              initialValues={{ courseName: initialValues.courseName, courseDescription: initialValues.courseDescription }}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(updateCourseById(values, courseId, accessToken))
                .then((response)=>{
                  if (response && response.status == 200 && response.statusText == 'OK'){
                    setModalObject('success', 'Success!','Course successfully updated.','',true)
                    getUpdatedCourse(response.data._id)
                  }else{
                    setModalObject('error', 'Error!',response.data.message,'',true)
                  }
                });
                setTimeout(() => {
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormLabel className={courseidStyles.label}>Course Name</FormLabel>
                  <InputGroup className="mb-3">
                    <FormControl
                      name="courseName"
                      type="text"
                      placeholder="Course Name"
                      aria-label="Course Name"
                      aria-describedby="courseName"
                      value={values.courseName}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </InputGroup>
                  <FormLabel className={courseidStyles.label}>Course Description</FormLabel>
                  <InputGroup className="mb-3">
                    <FormControl
                      name="courseDescription"
                      as="textarea"
                      placeholder="Course Description"
                      aria-label="Course Description"
                      aria-describedby="courseDescription"
                      value={values.courseDescription}
                      onChange={handleChange}
                      readOnly={readOnly}
                    />
                  </InputGroup>
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
                    <Button variant="primary" type="submit" disabled={isSubmitting} style={{ display: readOnly ? 'none' : 'block' }}>
                      <FontAwesomeIcon icon={faSave} />
                      {' '}
                      Save
                    </Button>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </Col>
        <Col>
          <div className={`${courseidStyles.courseDetails} mb-3`}>
            {userRole == 'instructor' ? (
              <Formik
                initialValues={{ moduleName: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  dispatch(addModule(values, accessToken, courseId))
                    .then((response) => {
                      if (response && response.status == 201 && response.statusText == 'Created') {
                        dispatch(getCourseById(courseId, accessToken))
                          .then((response) => {
                            if (response && response.status == 200 && response.statusText == 'OK') {
                              setCourseObj(response.data);
                            }
                          });
                      }
                    });
                  setTimeout(() => {
                    setSubmitting(false);
                  }, 400);
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
                    <FormLabel className={courseidStyles.label}>Add Module</FormLabel>
                    <InputGroup className="mb-3">
                      <FormControl
                        name="moduleName"
                        type="text"
                        placeholder="Module Name"
                        aria-label="Module Name"
                        aria-describedby="moduleName"
                        value={values.moduleName}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.moduleName && touched.moduleName && (<Alert key={errors.moduleName} variant="danger">{errors.moduleName}</Alert>)}
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
                        <FontAwesomeIcon icon={faPlus} />
                        {' '}
                        Add
                      </Button>
                    )}
                  </form>
                )}
              </Formik>
            ) : (
              <div>
                <div>
                  <Button variant="success" onClick={() => enrollCourse(courseId, accessToken)} disabled={isEnrolled}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    {' '}
                    Enroll
                  </Button>
                </div>
                <div>
                  {subscriptionObj ? (<p>You are currently Enrolled to this course</p>) : (<p />)}
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <div className={courseidStyles.courseTableList}>
        <Table id={courseidStyles.courseTableResponsive} responsive>
          <thead>
            <tr>
              <th>Modules</th>
              {userRole == 'instructor' ? (<th />) : (<th style={{ textAlign: 'center' }}>Description</th>)}
              {userRole == 'instructor' ? (<th />) : (<th style={{ textAlign: 'center' }} />)}
            </tr>
          </thead>
          <tbody>
            {moduleList && moduleList.length != 0 ? (
              moduleList.map((module) => (
                <tr key={module._id} id={module._id}>
                  <td>
                    <Link href={{ pathname: '/modules/[id]', query: { id: module._id } }} passHref>
                      <a>{module.title}</a>
                    </Link>
                  </td>
                  {userRole == 'instructor' ? (
                    <td />
                  ) : (
                    <td style={{ textAlign: 'center' }}>
                      {module.text}
                    </td>
                  )}
                  {userRole == 'instructor' ? (
                    <td style={{ textAlign: 'center' }}>
                      <DropdownButton id="dropdown-module-list-primary" title="" variant="primary">
                        <Link href={{ pathname: '/modules/[id]', query: { id: module._id } }} passHref>
                          <Dropdown.Item>Edit</Dropdown.Item>
                        </Link>
                        <Dropdown.Item key={module._id} onClick={() => removeModule(`${module._id}`, `${accessToken}`)}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </td>
                  ) : (
                    <td style={{ textAlign: 'center' }} />
                  )}
                </tr>
              ))
            ) : (
              <tr />
            )}
          </tbody>
        </Table>
      </div>
      <InformationModal show={toggleModal} onHide={() => setToggleModal(false)} type={modalType} title={modalTitle} body={modalBody} footer={modalFooter} />
    </Container>
  );
}
