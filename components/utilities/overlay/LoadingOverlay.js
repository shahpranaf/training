import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import * as LoadingOverlayStyle from './css/LoadingOverlay.module.css';


export default function LoadingOverlay(props) {
  return (
    <div className={LoadingOverlayStyle.fullscreenDiv}>
        <div className={LoadingOverlayStyle.text}>
            Loading Please wait 
            <div>
            <Spinner animation="grow" />
            </div>
        </div>
    </div>
  );
}

