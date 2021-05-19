import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import environment from '../../../environment';

// Slice

const initialState = {};
const { api } = environment;

const CourseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    getcourses: (state, action) => ({
      ...state,
      courses: [...action.payload],
    }),
    getselectedcourse: (state, action) => ({
      ...state,
      selectedcourse: [action.payload],
    }),
  },
});

export default CourseSlice.reducer;

const { getcourses, getselectedcourse } = CourseSlice.actions;

// Action

// Action to fetch All Courses
export const getCourses = (accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/courses`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    const courseArray = data.data.data;
    dispatch(getcourses(courseArray));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Add Course on Subject
export const addCourse = (data, accessToken, subjectId) => async () => {
  const postData = {
    title: data.courseName,
    description: data.courseDescription,
    subject: subjectId,
  };

  try {
    const response = await axios.post(`${api}/courses`, postData, {
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

// Get Course by ID
export const getCourseById = (courseId, accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/courses/${courseId}`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    dispatch(getselectedcourse(data.data));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Update Course By ID
export const updateCourseById = (data, id, accessToken) => async (dispatch) => {
  const postData = {
    title: data.courseName,
    description: data.courseDescription,
  };

  try {
    const response = await axios.patch(`${api}/courses/${id}`, postData, {
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

// Remove Course By Id
export const deleteCourseById = (courseId, accessToken) => async () => {
  try {
    const response = await axios.delete(`${api}/courses/${courseId}`, {
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
