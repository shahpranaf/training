import { useSelector, useDispatch } from 'react-redux';
import { React, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FormControl, Row, Col, Container,
} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import * as courselistStyles from '../../styles/courses/courselist.module.css';
import { getSubscriptions } from '../../redux/subscription/slices/SubscriptionSlice';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';
import amdLogo from '../../img/amd.png';


export default function courselist() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [checkAuth,setCheckAuth] = useState(false)

  const user = useSelector((state) => state.user);
  const userAccessToken = user.accessToken;
  const userSubcriptionList = useSelector((state) => state.subscriptions.subscriptions);
  const [textFilterValue, setTextFilterValue] = useState('');
  const [subscriptionList, setSubscriptionList] = useState(userSubcriptionList);

  useEffect(() => {
    if (user && user.accessToken == null){
      router.push({
        pathname: '/login',
        query: { authenticated: 0 },
      });
    }else if( user && user.accessToken){
      if(user.role == 'instructor'){
        router.push({
          pathname: '/',
          query: { role: user.role },
        });
      }else{
        setCheckAuth(true)
      }
     
    }
  }, []);
  

  useEffect(() => {
    if (!userSubcriptionList) {
      dispatch(getSubscriptions(userAccessToken))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            setSubscriptionList(response.data.data);
          }
        });
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
      </Row>
      <div className={courselistStyles.courselistCardList}>
        <Row>
          {subscriptionList && subscriptionList.length != 0 ? (
            subscriptionList.filter((item) => {
              if (!textFilterValue) {
                return true;
              }
              if (item.title.includes(textFilterValue)) {
                return true;
              }
            })
              .map((subscription) => (
                <Col key={subscription.course._id}>
                  <Card className={courselistStyles.card}>
                    <Card.Img variant="top" src={amdLogo} style={{ maxHeight: '100px' }} />
                    <Card.Body>
                      <Link href={{ pathname: '/courses/[id]', query: { id: subscription.course._id } }} passHref>
                        <Card.Title className={courselistStyles.cardTitle}><a><h5>{subscription.course.title}</h5></a></Card.Title>
                      </Link>
                      <Card.Text className={courselistStyles.cardText}>{subscription.course.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
          ) : (
            <div />
          )}
        </Row>
      </div>
    </Container>
  );
}
