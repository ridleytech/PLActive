import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/';
import Navigation from './Navigation';

//const store = createStore(reducers, applyMiddleware(thunk));

// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn:
//     'https://8e978838f1e14f1ab77426edb43367ba@o427372.ingest.sentry.io/5371313',
// });

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

export default () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};
