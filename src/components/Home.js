import React, {Component, useState} from 'react';
import {
  StyleSheet,
  NativeModules,
  SafeAreaView,
  AsyncStorage,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import Header from './Header';
//import PlayerMidi from './PlayerMidi';
import TestMidi from './TestMidi';
import MainMenu from './MainMenu';
import PitchMenu from './PitchMenu';
import IntervalMenu from './IntervalMenu';
import {
  setLevel,
  setMode,
  setIntervalProgress,
  setPitchProgress,
  manageGraph,
} from '../actions/';
import {getProgressData} from '../thunks/';
import IntervalLevels from './IntervalLevels';
import PitchLevels from './PitchLevels';
//import {AsyncStorage} from 'react-native-community/async-storage';

//https://www.npmjs.com/package/react-native-check-box
//cant update git

var testView = NativeModules.PlayKey;

class Home extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.retrieveData();
    //console.log('home props: ' + JSON.stringify(props));
  }

  retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('highestCompletedPitchLevel');

      if (value !== null) {
        // We have data!!
        console.log(`highestCompletedPitchLevel: ${value}`);
      } else {
        console.log('save default pitch data');

        value = 0;
        this.storePitchData();
      }

      this.props.setPitchProgress({
        highestCompletedPitchLevel: value,
      });
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem('highestCompletedIntervalLevel');

      if (value2 !== null) {
        // We have data!!
        console.log(`highestCompletedIntervalLevel: ${value2}`);
      } else {
        console.log('save default interval data');

        value2 = 0;
        this.storeIntervalData();
      }

      this.props.setIntervalProgress({
        highestCompletedIntervalLevel: value2,
      });
    } catch (error) {
      // Error retrieving data
    }

    //reset progress data
    // this.storePitchData();
    // this.storeIntervalData();
  };

  storePitchData = async () => {
    try {
      await AsyncStorage.setItem('highestCompletedPitchLevel', '0');
    } catch (error) {
      // Error saving data
    }
  };

  storeIntervalData = async () => {
    try {
      await AsyncStorage.setItem('highestCompletedIntervalLevel', '0');
    } catch (error) {
      // Error saving data
    }
  };

  componentDidMount() {
    this.props.getProgressData();

    if (this.props.graphStarted == false) {
      if (Platform.OS === 'ios') {
        testView.initGraph('url').then((result) => {
          console.log('show', result);

          this.props.manageGraph(true);
        });
      } else {
        console.log('initGraph android');
        testView.initGraph(
          (msg) => {
            console.log('error: ' + msg);
          },
          (response) => {
            console.log('response: ' + response);
          },
        );
        //   NativeModules.PlayKey.testGraph((err ,name) => {
        //     console.log(err, name);
        //  });
      }
    }
  }

  setMode = (mode) => {
    //console.log('showLevel: ' + level);

    this.props.setMode(mode);
  };

  showLevel = (level) => {
    console.log('showLevel: ' + level);

    // //debug
    // this.props.setLevel(level);
    // return;
    // //end debug

    if (this.props.isTrial && level > 1) {
      Alert.alert(
        null,
        `Please upgrade to Premium membership to unlock this level.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );

      return;
    } else {
      if (this.props.mode == 1) {
        if (level - 1 > this.props.highestCompletedPitchLevel) {
          Alert.alert(
            null,
            `Complete level ${
              this.props.highestCompletedPitchLevel + 1
            } to proceed`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          return;
        }
      } else {
        if (level - 1 > this.props.highestCompletedIntervalLevel) {
          Alert.alert(
            null,
            `Complete level ${
              this.props.highestCompletedIntervalLevel + 1
            } to proceed`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          return;
        }
      }
    }

    this.props.setLevel(level);
  };

  showMenu = () => {
    console.log('showMenu');
  };

  goBack = () => {
    console.log('go back');
  };

  loadMusic = () => {
    console.log('play');

    currentNote.play();
  };

  render() {
    return (
      <>
        <SafeAreaView />
        <Header props={this.props} />

        {/* <TouchableOpacity onPress={this.loadMusic}>
          <Text>Play</Text>
        </TouchableOpacity> */}

        {/* <TestMidi /> */}

        {this.props.mode == 0 ? (
          <MainMenu setMode={this.setMode} />
        ) : this.props.mode == 1 && this.props.level == 0 ? (
          <PitchMenu showLevel={this.showLevel} />
        ) : this.props.mode == 1 && this.props.level > 0 ? (
          <PitchLevels level={this.props.level} mode={this.props.mode} />
        ) : this.props.mode == 2 && this.props.level == 0 ? (
          <IntervalMenu showLevel={this.showLevel} />
        ) : this.props.mode == 2 && this.props.level > 0 ? (
          <IntervalLevels level={this.props.level} mode={this.props.mode} />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isTrial: state.isTrial,
    level: state.level,
    mode: state.mode,
    highestCompletedPitchLevel: state.highestCompletedPitchLevel,
    highestCompletedIntervalLevel: state.highestCompletedIntervalLevel,
    graphStarted: state.graphStarted,
  };
};

export default connect(mapStateToProps, {
  setLevel,
  setMode,
  setPitchProgress,
  setIntervalProgress,
  getProgressData,
  manageGraph,
})(Home);

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
