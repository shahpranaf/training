import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import environment from '../../../environment';

// Slice

const initialState = {};
const { api } = environment;

const SubscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    getsubscriptions: (state, action) => ({
      ...state,
      subscriptions: [...action.payload],
    }),
  },
});

export default SubscriptionSlice.reducer;

const { getsubscriptions } = SubscriptionSlice.actions;

// Action

// Action to Fetch All Subjects
export const getSubscriptions = (accessToken) => async (dispatch) => {
  try {
    const response = await axios.get(`${api}/subscription`, {
      headers: {
        Authorization: accessToken,
      },
    })
      .then((response) => response)
      .catch((error) => error.response);
    const data = response;
    const subjectArray = data.data.data;
    dispatch(getsubscriptions(subjectArray));
    return data;
  } catch (e) {
    return console.error(e.message);
  }
};

// Action to add Subscription
export const addSubscription = (courseId, accessToken) => async () => {
  const postData = {
    course: courseId,
  };

  try {
    const response = await axios.post(`${api}/subscription`, postData, {
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
