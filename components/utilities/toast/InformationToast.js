import Toast from 'react-bootstrap/Toast';
import { Button } from 'react-bootstrap';
import { React } from 'react';

export default function InformationToast(props) {
    return (
        <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'relative',
          minHeight: '100px',
        }}
      >
        <Toast
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <Toast.Header>
          
            <strong className="mr-auto">Bootstrap</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body>See? Just like this.</Toast.Body>
        </Toast>
      </div>
    );
  }