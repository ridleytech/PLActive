import React, {Component, useState} from 'react';
import {StyleSheet, NativeModules, SafeAreaView} from 'react-native';
var testView = NativeModules.PlayKey;
import {connect} from 'react-redux';
import Header from './Header';
//import PlayerMidi from './PlayerMidi';
import TestMidi from './TestMidi';
import MainMenu from './MainMenu';
import PitchMenu from './PitchMenu';
import IntervalMenu from './IntervalMenu';
import {setLevel, setMode} from '../actions/';
import IntervalLevels from './IntervalLevels';
import PitchLevels from './PitchLevels';

//https://www.npmjs.com/package/react-native-check-box

//cant update git

//var testView = NativeModules.PlayKey;

class Home extends Component<Props> {
  constructor(props: Props) {
    super(props);

    //console.log('home props: ' + JSON.stringify(props));
  }

  componentDidMount() {
    // testView.initGraph('url').then((result) => {
    //   console.log('show', result);
    // });
  }

  setMode = (mode) => {
    //console.log('showLevel: ' + level);

    this.props.setMode(mode);
  };

  showLevel = (level) => {
    //console.log('showLevel: ' + level);

    this.props.setLevel(level);
  };

  showMenu = () => {
    console.log('showMenu');
  };

  goBack = () => {
    console.log('go back');
  };

  render() {
    return (
      <>
        <SafeAreaView />
        <Header props={this.props} />
        <MainMenu setMode={this.setMode} />
        {/* <TestMidi /> */}
        {/* {this.props.mode == 0 ? (
          <MainMenu setMode={this.setMode} />
        ) : this.props.mode == 1 && this.props.level == 0 ? (
          <PitchMenu showLevel={this.showLevel} />
        ) : this.props.mode == 1 && this.props.level > 0 ? (
          <PitchLevels level={this.props.level} mode={this.props.mode} />
        ) : this.props.mode == 2 && this.props.level == 0 ? (
          <IntervalMenu showLevel={this.showLevel} />
        ) : this.props.mode == 2 && this.props.level > 0 ? (
          <IntervalLevels level={this.props.level} mode={this.props.mode} />
        ) : null} */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    mode: state.mode,
  };
};

export default connect(mapStateToProps, {setLevel, setMode})(Home);

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
