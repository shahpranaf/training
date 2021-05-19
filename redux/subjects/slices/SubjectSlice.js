import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import environment from '../../../environment';

// Slice

const initialState = {};
const { api } = environment;

const SubjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    getsubjects: (state, action) => ({
      ...state,
      subjects: [...action.payload],
    }),
    getselectedsubject: (state, action) => ({
      ...state,
      selectedsubject: [action.payload],
    }),
  },
});

export default SubjectSlice.reducer;

const { getsubjects, getselectedsubject } = SubjectSlice.actions;

// Action

// Action to Fetch All Subjects
export const getSubjects = (accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/subjects`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    const subjectArray = data.data.data;
    dispatch(getsubjects(subjectArray));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to getSubject By Id
export const getSubjectById = (subjectId, accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/subjects/${subjectId}`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    dispatch(getselectedsubject(data.data));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to add Subject
export const addSubject = (data, accessToken) => async () => {
  const postData = {
    title: data.title,
  };

  try {
    const response = await axios.post(`${api}/subjects`, postData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to update Subject By ID
export const updateSubjectById = (data, id, accessToken) => async (dispatch) => {
  const postData = {
    title: data.title,
  };

  try {
    const response = await axios.patch(`${api}/subjects/${id}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to delete Subject By ID
export const deleteSubjectById = (subjectId, accessToken) => async () => {
  try {
    const response = await axios.delete(`${api}/subjects/${subjectId}`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};
