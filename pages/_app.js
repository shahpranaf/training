import 'bootstrap/dist/css/bootstrap.min.css';
import 'suneditor/dist/css/suneditor.min.css';
import 'react-bootstrap';
import '../styles/globals.css'
import React, { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useSelector, Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import Layout from '../components/common/Layout';
import store from '../redux/store/index';

const makeStore = () => store;
const wrapper = createWrapper(makeStore);
const persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  const users = useSelector((state) => state.user);
  let isAuthenticated = users.accessToken || null;

  useEffect(() => {
    const lstg = window.localStorage;
    isAuthenticated = lstg.getItem('ACCESS_TOKEN') || null;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {isAuthenticated ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
