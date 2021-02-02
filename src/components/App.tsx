import React, {Component, useEffect} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/';
import Navigation from './Navigation/Navigation';
import SplashScreen from 'react-native-splash-screen';

//const store = createStore(reducers, applyMiddleware(thunk));

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn:
    'https://405ec551dfb843fbbb29c87007a110d4@o427372.ingest.sentry.io/5608301',
});

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);
const store = createStore(reducers, enhancer);

//https://www.netguru.com/codestories/react-native-splash-screen

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};
