import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import loginConfig from '../configuration/LoginConfig';
import environment from '../../../environment';

// Slice

const initialState = {};
const { api } = environment;

const LoginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateacesstoken: (state, action) => {
      state.accessToken = action.payload;
    },
    fetchuser: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    removeuser: () => {},
  },
});

export default LoginSlice.reducer;

const { updateacesstoken, fetchuser, removeuser } = LoginSlice.actions;

// Action

// Action to Login User
export const loginUser = (data) => async (dispatch) => {
  const lstg = window.localStorage;

  const postData = {
    email: data.email,
    password: data.password,
    strategy: 'local',
  };

  try {
    const response = await axios.post(`${api}/authentication`, postData, loginConfig)
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    if (data && data.status == 201) {
      lstg.setItem('ACCESS_TOKEN', data.data.accessToken);
      dispatch(updateacesstoken(data.data.accessToken));
    }
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to fetch User Data
export const getUserDetails = (accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/users`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;

    if (data && data.status == 200) {
      dispatch(fetchuser(data.data.data[0]));
    }

    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to Logout User
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(removeuser());
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to change User password
export const changeUserPassword = (data, userEmail) => async () => {
  const postData = {
    action: 'passwordChange',
    value: {
      user: { email: userEmail.toString() },
      oldPassword: data.oldPass.toString(),
      password: data.newPass.toString(),
    },
  };

  try {
    const response = await axios.post(`${api}/authmanagement`, postData)
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to change User Access Token
export const changeAuthentication = (accessToken) => async (dispatch) => {
  try {
    dispatch(updateacesstoken(accessToken));
  } catch (e) {
    return console.error(e.message);
  }
};
