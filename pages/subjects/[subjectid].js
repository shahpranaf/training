import {
  FormControl, Button, Row, Col, InputGroup, Alert, Spinner, Container, Table, FormFile, FormGroup, DropdownButton, Dropdown, FormLabel,
} from 'react-bootstrap';
import { Formik } from 'formik';
import {React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as subjectidStyles from '../../styles/subjects/[subjectid].module.css';
import { updateSubjectById, getSubjectById } from '../../redux/subjects/slices/SubjectSlice';
import { addCourse, deleteCourseById } from '../../redux/courses/slices/CourseSlice';
import InformationModal from '../../components/utilities/modal/InformationModal';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';

export async function getServerSideProps(context) {
  const subjectQuery = context.query;
  return {
    props: { subjectQuery },
  };
}

export default function subjectid(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const selectedSubject = useSelector((state) => state.subjects.selectedsubject)
  const accessToken = user.accessToken || '';
  const subjectId = props.subjectQuery.id ? props.subjectQuery.id : selectedSubject[0]._id;

  const [subjectObj, setSubjectObj] = useState();
  const courseList = subjectObj && subjectObj.courses;

  // Modal Properties
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalFooter, setModalFooter] = useState('');
  const [toggleModal, setToggleModal] = useState(false);

  const [checkAuth,setCheckAuth] = useState(false)

  const initialValues = {
    subjectTitle: subjectObj ? subjectObj.title : '',
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
    if (subjectId) {
      dispatch(getSubjectById(subjectId, accessToken))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            setSubjectObj(response.data);
          }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      setSubjectObj(selectedSubject[0])
    }
  }, []);

  function getUpdatedSubject(subjectId){
    dispatch(getSubjectById(subjectId, accessToken))
    .then((response) => {
      if (response && response.status == 200 && response.statusText == 'OK') {
        setSubjectObj(response.data);
      }
  });
  }

  function setModalObject(type, title, body,footer,toggle){
    setToggleModal(toggle);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer);
  }

  function removeCourse(id, moduleCount) {
    if (user._id != subjectObj.owner._id) {
      setModalObject('warning', 'Warning!','Only the owner can delete the course.','',true)
    } else if (user._id == subjectObj.owner._id) {
      if (moduleCount != 0) {
        setModalObject('warning', 'Warning!','You cannot delete course with modules. Delete Module First.','',true)
      } else {
        dispatch(deleteCourseById(id, accessToken))
          .then((response) => {
            if (response && response.status == 200 && response.statusText == 'OK') {
              dispatch(getSubjectById(subjectId, accessToken))
                .then((response) => {
                  if (response && response.status == 200 && response.statusText == 'OK') {
                    setSubjectObj(response.data);
                  }
                  setModalObject('success','Success!','Course successfully deleted.','',true)
                });
            }
          });
      }
    }
  }

  return (
    <Container fluid>
      {!checkAuth && <LoadingOverlay/>}
      <Row>
        <Col>
          <div className={`${subjectidStyles.subjectDetails} mb-3`}>
            <div className={subjectidStyles.subjectHeaderTitle}>
              <h4><b>Subject Detail</b></h4>
            </div>
            <Formik
              enableReinitialize
              initialValues={{ title: initialValues.subjectTitle }}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(updateSubjectById(values, subjectId, accessToken))
                  .then((response) => {
                    if (response && response.status == 200 && response.statusText == 'OK') {
                      getUpdatedSubject(response.data._id)
                      setModalObject('success','Success!','Subject Succesfully Updated','',true)
                    } else {
                      setModalObject('error','Error!',response.data.message,'',true)
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
                  <FormLabel className={subjectidStyles.label}>Subject Title</FormLabel>
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
                  {isSubmitting ? (
                    <Button id={subjectidStyles.button}  variant="primary" type="submit" disabled={isSubmitting}>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </Button>
                  ) : (
                    <Button id={subjectidStyles.button} variant="primary" type="submit" disabled={isSubmitting}>
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
          <div className={`${subjectidStyles.courseDetails} mb-3"`}>
            <Formik
              initialValues={{ courseName: '', courseDescription: '', file: '' }}
              onSubmit={(values, { setSubmitting }) => {
                if (user && user.role == 'instructor') {
                  dispatch(addCourse(values, accessToken, subjectId))
                    .then((response) => {
                      if (response && response.status == 201 && response.statusText == 'Created') {
                        setModalObject('success','Sucess!','Course Succesfully Added.','',true)
                        dispatch(getSubjectById(subjectId, accessToken))
                          .then((response) => {
                            if (response && response.status == 200 && response.statusText == 'OK') {
                              setSubjectObj(response.data);
                            }
                          });
                      } else {
                        setModalObject('error', 'Error!',response.data.message,'',true)
                      }
                    });
                } else {
                  setModalObject('warning','Warning!','Only Instructors can add courses.','',true)
                }
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
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormLabel className={subjectidStyles.label}>Add Course</FormLabel>
                  <InputGroup className="mb-3">
                    <FormControl
                      name="courseName"
                      type="text"
                      placeholder="Course Name"
                      aria-label="Course Name"
                      aria-describedby="courseName"
                      value={values.courseName}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.courseName && touched.courseName && (<Alert key={errors.courseName} variant="danger">{errors.courseName}</Alert>)}
                  <InputGroup className="mb-3">
                    <FormControl
                      name="courseDescription"
                      as="textarea"
                      placeholder="Course Description"
                      aria-label="Course Description"
                      aria-describedby="courseDescription"
                      value={values.description}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.description && touched.description && <Alert key={errors.description} variant="danger">{errors.description}</Alert>}
                  <FormGroup className="mb-3">
                    <FormFile
                      id="file"
                      label="Upload your file"
                      onChange={(event) => {
                        setFieldValue('file', event.currentTarget.files[0]);
                      }}
                    />
                  </FormGroup>
                  {isSubmitting ? (
                    <Button id={subjectidStyles.button} variant="primary" type="submit" disabled={isSubmitting}>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </Button>
                  ) : (
                    <Button id={subjectidStyles.button} variant="primary" type="submit" disabled={isSubmitting}>
                      <FontAwesomeIcon icon={faPlus} />
                      {' '}
                      Add
                    </Button>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
      <div className={subjectidStyles.subjectTableList}>
        <Table id={subjectidStyles.subjectTableResponsive} responsive>
          <thead>
            <tr>
              <th>Course</th>
              <th style={{ textAlign: 'center' }}>Modules</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {courseList && courseList.length != 0 ? (
              courseList.map((course) => (
                <tr key={course._id} id={course._id}>
                  <td>
                    <Link href={{ pathname: '/courses/[id]', query: { id: course._id } }} passHref>
                      <a>{course.title}</a>
                    </Link>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {course.modules.length}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <DropdownButton id="dropdown-main-menu-primary" title="" variant="primary">
                      <Link href={{ pathname: '/courses/id', query: { id: course._id } }} passHref>
                        <Dropdown.Item>Edit</Dropdown.Item>
                      </Link>
                      <Dropdown.Item key={course._id} onClick={() => removeCourse(`${course._id}`, `${course.modules.length}`)}>Delete</Dropdown.Item>
                    </DropdownButton>
                  </td>
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
