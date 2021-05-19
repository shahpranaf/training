import {
  FormControl, Row, Col, Container,
} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { React, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import * as indexStyles from '../styles/index.module.css';
import { getUserDetails } from '../redux/login/slices/LoginSlice';
import { getCourses } from '../redux/courses/slices/CourseSlice';
import { getSubjects } from '../redux/subjects/slices/SubjectSlice';
import { getModules } from '../redux/modules/slices/ModuleSlice';
import { getSubscriptions } from '../redux/subscription/slices/SubscriptionSlice';
import InformationModal from '../components/utilities/modal/InformationModal';
import LoadingOverlay from '../components/utilities/overlay/LoadingOverlay';
import amdLogo from '../img/amd.png';


export default function index() {
  const dispatch = useDispatch();
  const router = useRouter();

  //Get Data from store
  const user = useSelector((state) => state.user) || '';
  const courseList = useSelector((state) => state.courses.courses) || '';
  const subscriptionList = useSelector((state) => state.subscriptions.subscriptions) || '';

  // Modal Properties
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalFooter, setModalFooter] = useState('');
  const [toggleModal, setToggleModal] = useState(false);

  const [checkAuth,setCheckAuth] = useState(false)

  const routerQuery = router.query

  const isAuthenticated = user.accessToken ? true : false;
  const [textFilterValue, setTextFilterValue] = useState('');
  const [selectFilterValue, setSelectFilterValue] = useState('all');

  const routerObj = {
    pathName: ''
  }

  useEffect(() => {
    if (user && user.accessToken == null){
      router.push({
        pathname: '/login',
      });
    }else if(user && user.accessToken){
      setCheckAuth(true)
    }
  }, []);

  useEffect(() => {
    if (routerQuery && routerQuery.role == 'student'){
      setModalObject('error','Error!','Only Instructors are allowed.','',true)
    }else if (routerQuery && routerQuery.role == 'instructor'){
      setModalObject('error','Error!','Only students are allowed.','',true)
    }
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(getUserDetails(user.accessToken));
      dispatch(getSubjects(user.accessToken));
      dispatch(getCourses(user.accessToken));
      dispatch(getModules(user.accessToken));
      if (user && user.role == 'student') {
        dispatch(getSubscriptions(user.accessToken));
      }
    }else{
      routerObj.pathName = '/login'
      router.push(routerObj.pathName)
    }
  }, []);

  function handleSearchFilter(val) {
    if (typeof val !== 'string') {
      return '';
    }
    const seperateWord = val.toLowerCase().split(' ');
    for (let a = 0; a < seperateWord.length; a++) {
      seperateWord[a] = seperateWord[a].charAt(0).toUpperCase() + seperateWord[a].substring(1);
    }
    const newValue = seperateWord.join(' ');
    setTextFilterValue(newValue);
  }

  function handleSelectedChange(event) {
    const newValue = event.target.value;
    setSelectFilterValue(newValue);
  }

  function setModalObject(type,title,body,footer,toggle){
    setToggleModal(toggle);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer);
  }

  return (
    <Container fluid>
       {!checkAuth && <LoadingOverlay/>}
      <Row>
        <Col>
          <h4>All Available Courses</h4>
        </Col>
        <Col xs="2">
          <FormControl
            name="searchCourse"
            type="text"
            placeholder="Search Course"
            aria-label="Search Course"
            aria-describedby="searchCourse"
            onChange={(e) => handleSearchFilter(e.target.value)}
            size="sm"
            maxLength="15"
          />
        </Col>
        <Col xs="2">
          <FormControl as="select" size="sm" custom onChange={(e) => handleSelectedChange(e)}>
            <option value="all">Show All Courses</option>
            <option value="specific">Show All your Courses</option>
          </FormControl>
        </Col>
      </Row>
      <div className={indexStyles.courseCardList}>
        <Row>
          {courseList && courseList.length != 0 ? (
            courseList.filter((item) => {
              if (selectFilterValue == 'all') {
                if (!textFilterValue) {
                  return true;
                }
                if (!selectFilterValue) {
                  return true;
                }
                if (item.title.includes(textFilterValue)) {
                  return true;
                }
              } else if (selectFilterValue == 'specific') {
                for (const b in subscriptionList) {
                  if (subscriptionList[b].course._id == item._id) {
                    return true;
                  }
                }
              }
            })
              .map((course) => (
                <Col key={course._id}>
                  <Card className={indexStyles.card}>
                    <Card.Img variant="top" src={amdLogo} style={{ maxHeight: '100px' }} />
                    <Card.Body>
                      <Link href={{ pathname: '/courses/[id]', query: { id: course._id } }} passHref>
                        <Card.Title className={indexStyles.cardTitle}><a><h5>{course.title}</h5></a></Card.Title>
                      </Link>
                      <Card.Text className={indexStyles.cardText}>{course.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
          ) : (
            <div />
          )}
        </Row>
      </div>
      <InformationModal show={toggleModal} onHide={() => setToggleModal(false)} type={modalType} title={modalTitle} body={modalBody} footer={modalFooter} />
    </Container>
  );
}
