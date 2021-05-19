import { combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import initialState from './store';
import user from '../login/slices/LoginSlice';
import courses from '../courses/slices/CourseSlice';
import subjects from '../subjects/slices/SubjectSlice';
import modules from '../modules/slices/ModuleSlice';
import subscriptions from '../subscription/slices/SubscriptionSlice';

const eLearningReducers = combineReducers({
  user,
  courses,
  subjects,
  modules,
  subscriptions,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'subjects', 'courses', 'modules', 'subscriptions'],
};

const rootReducer = (state, action) => {
  if (action.type === 'user/removeuser') {
    window.localStorage.removeItem('persist:root');
    window.sessionStorage.removeItem('persist:root');
    window.localStorage.removeItem('ACCESS_TOKEN');
    window.sessionStorage.removeItem('ACCESS_TOKEN');
    state = initialState;
  }
  return eLearningReducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

const storeEnhancer = [
  applyMiddleware(...middleware),
];

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initialState,
  devTools: composeWithDevTools,
  enhancers: storeEnhancer,
  middleware: [thunk],

});

export default store;
