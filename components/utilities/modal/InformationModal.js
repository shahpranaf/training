/* eslint-disable react/jsx-props-no-spreading */
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { React } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

library.add(faCheckCircle, faTimesCircle, faInfoCircle,faExclamationCircle);

export default function InformationModal(props) {
  const router = useRouter();


  const typeToIcon = {
    error: 'times-circle',
    success: 'check-circle',
    warning: 'exclamation-circle'
  };

  const typeToHeaderStyle = {
    error: {
      background: '#E85E6C',
    },
    success: {
      background: '#47C9A2',
    },
    warning: {
      background: '#FFF3CD'
    }

  };

  const modalTitleStyle = {
    width: '100%',
    textAlign: 'center',
  };

  const modalBodyStyle = {
    textAlign: 'center',
  };

  const iconDisplay = typeToIcon[props.type] != undefined ? typeToIcon[props.type] : 'info-circle';

  function onHide(props){
    props.onHide(true)
    router.push({
      pathname: router.pathname,
    }, 
    undefined, { shallow: true }
    )
  }

  return (
    <Modal
      {...props}
      dialogClassName="modal-50w"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      animation
    >
      <Modal.Header style={typeToHeaderStyle[props.type]}>
        <Modal.Title id="contained-modal-title-vcenter" style={modalTitleStyle}>
          <FontAwesomeIcon className="fa-3x" icon={iconDisplay} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle}>
        <h2><b>{props.title}</b></h2>
        <p>
          {props.body}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => onHide(props)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
