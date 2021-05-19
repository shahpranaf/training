// config/buttons.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const navButtons = [
  {
    label: 'Subjects',
    path: '/subjects',
    icon: <FontAwesomeIcon icon={faAddressBook} />,
  },
  {
    label: 'Courses',
    path: '/nearme',
    icon: <FontAwesomeIcon icon={faMapMarkerAlt} />,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <FontAwesomeIcon icon={faUser} />,
  },
];

export default navButtons;
