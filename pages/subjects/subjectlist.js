import {
  Table, Button
} from 'react-bootstrap';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import InformationModal from '../../components/utilities/modal/InformationModal';
import * as subjectlistStyles from '../../styles/subjects/subjectlist.module.css';
import { getUserDetails } from '../../redux/login/slices/LoginSlice';
import { getSubjects, deleteSubjectById } from '../../redux/subjects/slices/SubjectSlice';
import { getCourses } from '../../redux/courses/slices/CourseSlice';
import { getModules } from '../../redux/modules/slices/ModuleSlice';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';

export default function subjectlist() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const accessToken = user.accessToken || '';
  const lstg = window.localStorage;

  // Modal Properties
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalFooter, setModalFooter] = useState('');
  const [toggleModal, setToggleModal] = useState(false);

  const [checkAuth,setCheckAuth] = useState(false)

  const getSubject = useSelector((state) => state.subjects.subjects);
  const [subscriptionList, setSubscriptionList] = useState(getSubject);

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

  useEffect(() => {
    if (user && user.id == null) {
      if (accessToken == null || accessToken == '') {
        const userAuth =  lstg.getItem('ACCESS_TOKEN') || null;
        if (userAuth) {
          dispatch(getUserDetails(userAuth));
          dispatch(getSubjects(userAuth));
          dispatch(getCourses(userAuth));
          dispatch(getModules(userAuth));
        }
      } else {
        dispatch(getUserDetails(accessToken));
        dispatch(getSubjects(accessToken));
        dispatch(getCourses(accessToken));
        dispatch(getModules(accessToken));
      }
    }
  }, []);

  useEffect(() => {
    setSubscriptionList(getSubject);
  });

  function handleAddSubject() {
    routerObj.pathName = '/subjects/newsubject';
    router.push(routerObj.pathName);
  }

  function setModalObject(type,title,body,footer,toggle){
    setToggleModal(toggle);
    setModalType(type);
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer);
  }

  function removeSubject(id, subjectOwnerId, courseLength) {
    if (user._id != subjectOwnerId) {
      setModalObject('warning','Warning!','Only the owner can delete the subject.','',true)
    } else if (user._id == subjectOwnerId) {
      if (courseLength != 0) {
        setModalObject('warning','Warning!','Subject has correspending course. Delete Course First.','',true)
      } else {
        dispatch(deleteSubjectById(id, accessToken))
          .then((response) => {
            if (response && response.status == 200 && response.statusText == 'OK') {
              dispatch(getSubjects(accessToken));
              setModalObject('success','Success!','Subject successfully deleted.','',true)
            }
          });
      }
    }
  }

  return (
    <div>
      {!checkAuth && <LoadingOverlay/>}
      <div className={subjectlistStyles.addSubjectButton}>
        <Button id={subjectlistStyles.button} variant="primary" onClick={handleAddSubject}>
          <FontAwesomeIcon icon={faPlus} />
          Add Subject
        </Button>
      </div>
      <div className={subjectlistStyles.tableSubject}>
        <Table striped responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ textAlign: 'center' }}>Courses</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {subscriptionList && subscriptionList.length != 0 ? (
              subscriptionList.map((subject) => (
                <tr key={subject._id} id={subject._id}>

                  <td>
                    <Link href={{ pathname: '/subjects/[id]', query: { id: subject._id } }} passHref>
                      <a>{subject.title}</a>
                    </Link>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {subject.courses.length}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <FontAwesomeIcon className={subjectlistStyles.trashIcon} icon={faTrash} onClick={() => removeSubject(`${subject._id}`, `${subject.owner._id}`, `${subject.courses.length}`)} />
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
    </div>
  );
}
