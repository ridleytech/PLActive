import React, {Component, useState} from 'react';
import {
  StyleSheet,
  NativeModules,
  SafeAreaView,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import Header from './Header';
//import PlayerMidi from './PlayerMidi';

//import IntervalMenu from './IntervalMenu';
import {setLeaderboardMode} from '../actions/';
import LeaderboardModes from './LeaderboardModes';
import Leaderboard2 from './Leaderboard2';

//console.log('store: ' + store);

class LeaderboardMenu extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  setMode = (mode) => {
    console.log('setMode: ' + mode);

    this.props.setLeaderboardMode(mode);
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

        {this.props.leaderboardMode == 0 ? (
          <LeaderboardModes setMode={this.setMode} />
        ) : (
          <Leaderboard2 />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    leaderboardMode: state.leaderboardMode,
  };
};

export default connect(mapStateToProps, {setLeaderboardMode})(LeaderboardMenu);

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
