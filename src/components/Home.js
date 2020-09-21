import React, {Component, useState} from 'react';
import {StyleSheet, NativeModules, SafeAreaView} from 'react-native';
var testView = NativeModules.PlayKey;
import {connect} from 'react-redux';
import Header from './Header';
import IntervalLevel1 from './IntervalLevel1';
//import PlayerMidi from './PlayerMidi';
import TestMidi from './TestMidi';
import Menu from './Menu';
import {setLevel} from '../actions/';
import IntervalLevels from './IntervalLevels';

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
        {/* <TestMidi /> */}
        {this.props.level == 0 ? (
          <Menu showLevel={this.showLevel} />
        ) : this.props.level == 1 ? (
          <IntervalLevel1 level={this.props.level} />
        ) : this.props.level > 1 ? (
          <IntervalLevels level={this.props.level} />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
  };
};

export default connect(mapStateToProps, {setLevel})(Home);

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
