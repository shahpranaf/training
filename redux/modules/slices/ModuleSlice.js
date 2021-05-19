import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import environment from '../../../environment';

// Slice

const initialState = {};
const { api } = environment;

const ModuleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    addmodules: (state, action) => ({
      ...state,
      modules: [...action.payload],
    }),
    getselectedmodule: (state, action) => ({
      ...state,
      selectedmodule: [action.payload],
    }),
  },
});

export default ModuleSlice.reducer;

const { addmodules, getselectedmodule } = ModuleSlice.actions;

// Action

// Action to Fetch All Modules
export const getModules = (accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/modules`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    const moduleArray = data.data.data;
    dispatch(addmodules(moduleArray));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action get Module by ID
export const getModuleById = (moduleId, accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/modules/${moduleId}`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    dispatch(getselectedmodule(data.data));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to add Module
export const addModule = (data, accessToken, courseId) => async () => {
  const postData = {
    title: data.moduleName,
    text: data.moduleText,
    course: courseId,
  };

  try {
    const response = await axios.post(`${api}/modules`, postData, {
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

// Action to update Module by Id
export const updateModuleById = (data, id, accessToken) => async () => {
  const postData = {
    title: data.moduleName,
    text: data.moduleDescription,
  };

  try {
    const response = axios.patch(`${api}/modules/${id}`, postData, {
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

// Action to delete Module by Id
export const deleteModuleById = (moduleId, accessToken) => async () => {
  try {
    const response = await axios.delete(`${api}/modules/${moduleId}`, {
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
