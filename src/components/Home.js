import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import CheckBox from 'react-native-check-box';
var testView = NativeModules.PlayKey;

// import WhiteIcon from '../../images/blank.jpg';
// import BlackIcon from '../../images/black.png';
// import RB from '../../RoundButtonPart';

import data from '../data/questions.json';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
import Header from './Header';
import IntervalLevel1 from './IntervalLevel1';
import IntervalLevel2 from './IntervalLevel2';
import Player3 from './Player3';
import TestMidi from './TestMidi';
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(reducers, enhancer);

//https://www.npmjs.com/package/react-native-check-box

//cant update git

class Home extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      level: 2,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <>
        <Provider store={store}>
          <SafeAreaView></SafeAreaView>
          {/* <Header /> */}
          <TestMidi />
          {/* <Player3 /> */}
          {/* <Player2 tracks={TRACKS} /> */}
          {/* {this.state.level == 1 ? (
            <IntervalLevel1 />
          ) : this.state.level == 2 ? (
            <IntervalLevel2 />
          ) : null} */}
        </Provider>
      </>
    );
  }
}

export default Home;

let offset = 100;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  checkbox: {
    alignSelf: 'center',
  },
  previewBtn: {
    marginTop: 50,
  },
  whiteKeys: {
    marginTop: 140,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  blackKeys: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon2: {
    position: 'absolute',
    left: 30 + offset,
    zIndex: 1,
  },
  icon3: {
    position: 'absolute',
    left: 78 + offset,
    zIndex: 1,
  },
  icon4: {
    position: 'absolute',
    left: 173 + offset,
    zIndex: 1,
  },
  icon5: {
    position: 'absolute',
    left: 222 + offset,
    zIndex: 1,
  },
  icon6: {
    position: 'absolute',
    left: 270 + offset,
    zIndex: 1,
  },
  above: {
    position: 'absolute',
    left: 320,
    zIndex: 3,
  },
});
