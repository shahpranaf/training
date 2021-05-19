import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import * as LayoutStyles from './css/Layout.module.css';

function Layout(props) {
  const appTitle = 'E Learning';
  return (
    <div className={LayoutStyles.layout}>
      <Head>
        <title>eLearning</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>

      <Header appTitle={appTitle} props={props} />
      <div className={LayoutStyles.layoutContent}>
        <div className={LayoutStyles.appWrapper}>
          {props.children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
