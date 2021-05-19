import {
  FormControl, Button, Row, Col, InputGroup, Alert, Spinner, Container, FormLabel,
} from 'react-bootstrap';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SunEditor from 'suneditor-react';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import * as moduleidStyles from '../../styles/modules/[moduleid].module.css';
import suneditorConfig from '../../components/common/settings/Suneditor-config';
import { updateModuleById, getModuleById } from '../../redux/modules/slices/ModuleSlice';
import InformationModal from '../../components/utilities/modal/InformationModal';
import LoadingOverlay from '../../components/utilities/overlay/LoadingOverlay';

export async function getServerSideProps(context) {
  const moduleQuery = context.query;
  return {
    props: { moduleQuery },
  };
}

export default function moduleid(props) {

  const router = useRouter();
  const dispatch = useDispatch();

  // Get Data from Store
  const user = useSelector((state) => state.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const selectedmodule = useSelector((state) => state.modules.selectedmodule)

  const [checkAuth,setCheckAuth] = useState(false)
  

  // Check User Role
  const userRole = user.role;
  const readOnly = userRole == 'student';

  const moduleId = props.moduleQuery.id ? props.moduleQuery.id : selectedmodule[0]._id;

  const [moduleObj, setModuleObj] = useState();

  const initialValues = {
    moduleName: moduleObj ? moduleObj.title : '',
    moduleDescription: moduleObj ? moduleObj.text : '',
  };

    // Modal Properties
    const [modalType, setModalType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalFooter, setModalFooter] = useState('');
    const [toggleModal, setToggleModal] = useState(false);

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
    if (selectedmodule) {
      setModuleObj(selectedmodule[0])
    }
  }, []);

  useEffect(() => {
    if (moduleId) {
      dispatch(getModuleById(moduleId, accessToken))
        .then((response) => {
          if (response && response.status == 200 && response.statusText == 'OK') {
            setModuleObj(response.data);
          }
        });
    }
  }, []);

  function getUpdatedModule(moduleId){
    dispatch(getModuleById(moduleId, accessToken))
    .then((response) => {
      if (response && response.status == 200 && response.statusText == 'OK') {
        setModuleObj(response.data);
      }
  });
  }

  function redirectTo() {
    router.back();
  }

  return (
    <div className={moduleidStyles.moduleFormWrapper}>
      {!checkAuth && <LoadingOverlay/>}
      <Container fluid>
        <div className={`${moduleidStyles.moduleDetails} mb-3`}>
          <Formik
            enableReinitialize
            validateOnChange
            initialValues={{ moduleName: initialValues.moduleName, moduleDescription: initialValues.moduleDescription }}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(updateModuleById(values, moduleId, accessToken))
              .then((response) => {
                if(response && response.status == 200 && response.statusText == 'OK'){
                  setToggleModal(true);
                  setModalType('success');
                  setModalTitle('Success!');
                  setModalBody('Module successfully updated.');
                  setModalFooter('');
                  getUpdatedModule(response.data._id)
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
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <FormLabel>Module Name</FormLabel>
                <InputGroup className="mb-3">
                  <FormControl
                    name="moduleName"
                    type="text"
                    placeholder="Module Name"
                    aria-label="Module Name"
                    aria-describedby="moduleName"
                    value={values.moduleName}
                    onChange={handleChange}
                    readOnly={readOnly}
                  />
                </InputGroup>
                {errors.moduleName && touched.moduleName && (<Alert key={errors.moduleName} variant="danger">{errors.moduleName}</Alert>)}
                <FormLabel>Module Description</FormLabel>
                <InputGroup className="mb-3">
                  <SunEditor
                    disabled
                    setOptions={{
                      ...suneditorConfig,
                    }}
                    onKeyUp={(event) => {
                      setFieldValue('moduleDescription', event.target.innerText);
                    }}
                    setContents={values.moduleDescription}
                  />
                </InputGroup>
                {errors.description && touched.description && (<Alert key={errors.description} variant="danger">{errors.description}</Alert>)}
                <Row>
                  <Col>
                    {isSubmitting ? (
                      <Button id={moduleidStyles.button} variant="primary" type="submit" disabled={isSubmitting}>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </Button>
                    ) : (
                      <Button id={moduleidStyles.button} variant="primary" type="submit" disabled={isSubmitting}>
                        <FontAwesomeIcon icon={faSave} />
                        {' '}
                        Save
                      </Button>

                    )}
                    <Button id={moduleidStyles.button} variant="secondary" onClick={() => redirectTo()}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </div>
        <InformationModal show={toggleModal} onHide={() => setToggleModal(false)} type={modalType} title={modalTitle} body={modalBody} footer={modalFooter} />
      </Container>
    </div>
  );
}
