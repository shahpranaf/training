import Alert from 'react-bootstrap/Alert';
import React, { useState } from 'react';

export default function AlertBox(props) {
  const [show, setShow] = useState(props.show);

  function toggleShow() {
    { props.toggleShowAlert && props.toggleShowAlert(false); }
    setShow(false);
  }
  return (
    <Alert variant={props.type} onClose={() => toggleShow()} show={show} dismissible={props.dismissible}>
      <Alert.Heading>{props.header}</Alert.Heading>
      <p>
        {props.message}
      </p>
    </Alert>
  );
}
