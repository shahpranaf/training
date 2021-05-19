import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import loginConfig from '../../login/configuration/LoginConfig';
import environment from '../../../environment';
// Slice

const initialState = {};
const { api } = environment;

const RegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    adduser: (state, action) => ({
      ...state,
      ...action,
    }),
  },
});

export default RegisterSlice.reducer;

// Action

export const registerUser = (data) => async () => {
  const postData = {
    email: data.email,
    password: data.password,
    role: data.roleName,
    firstName: data.firstName,
    lastName: data.lastName,
  };
  try {
    const response = await axios.post(`${api}/users`, postData, loginConfig)
      .then((response) => response)
      .catch((error) => error.response);

    return response;
  } catch (e) {
    return console.error(e.message);
  }
};
