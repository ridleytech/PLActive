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
import MainMenu from './MainMenu';
import PitchMenu from './PitchMenu';
import SignIn from './Auth/SignIn';
import IntervalMenu from './IntervalMenu';
import {
  setLevel,
  setMode,
  setIntervalProgress,
  setPitchProgress,
  manageGraph,
  login,
  showLogin,
  setUsername,
  setDeviceUsername,
} from '../actions/';
import {getProgressData, saveTestScore, getAccess} from '../thunks/';
import IntervalLevels from './IntervalLevels';
import PitchLevels from './PitchLevels';
import AsyncStorage from '@react-native-async-storage/async-storage';
//https://www.npmjs.com/package/react-native-check-box
//cant update git

var testView = NativeModules.PlayKey;

//console.log('store: ' + store);

class Home extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.retrieveData();
    this.retrieveUserData();
    //console.log('home props: ' + JSON.stringify(props));
  }

  retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('highestCompletedPitchLevel');

      if (value !== null) {
        // We have data!!
        console.log(`highestCompletedPitchLevel: ${value}`);
      } else {
        //console.log('save default pitch data');

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
        //console.log('save default interval data');

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

  storeNewAppUserData = async () => {
    var id = this.makeid(8);
    try {
      await AsyncStorage.setItem('newAppUser', id);

      console.log('newAppUser created');
    } catch (error) {
      // Error saving data
      console.log('cant create newAppUser ');
    }
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

  retrieveUserData = async () => {
    try {
      var value = await AsyncStorage.getItem('username');

      if (value !== null) {
        // We have data!!
        console.log(`retrieved username: ${value}`);
        this.props.setUsername(value);

        this.setState({
          usernameVal: value,
        });

        // /this.props.login(true);
      } else {
        console.log('no username');

        this.setState({
          usernameVal: null,
        });
      }
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem('password');

      if (value2 !== null) {
        // We have data!!
        console.log(`retrieved password: ${value2}`);

        this.setState({
          passwordVal: value2,
        });
      } else {
        console.log('no password');

        this.setState({
          passwordVal: null,
        });
      }
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem('hasUser');

      if (value2 !== null) {
        // We have data!!
        console.log(`retrieved user: ${value2}`);

        this.setState({
          hasUser: value2,
        });

        this.props.getProgressData();

        this.props.login(true);
      } else {
        console.log('no user');

        this.setState({
          hasUser: null,
        });

        try {
          var value2 = await AsyncStorage.getItem('newAppUser');

          if (value2 !== null) {
            // We have data!!
            console.log(`newAppUser: ${value2}`);
            //this.storeNewAppUserData();

            this.props.setUsername(value2);
            this.props.setDeviceUsername(value2);

            // try {
            //   await AsyncStorage.removeItem('newAppUser');

            //   console.log('newAppUser deleted');
            // } catch (error) {
            //   // Error saving data
            //   console.log('cant delete 2');
            // }
          } else {
            console.log('save default interval data new user');

            this.storeNewAppUserData();
          }
        } catch (error) {
          // Error retrieving data
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  makeid = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  storeUsername = async () => {
    try {
      await AsyncStorage.setItem('username', this.props.username);

      console.log('username saved: ' + this.props.username);
    } catch (error) {
      // Error saving data
    }
  };

  storePassword = async () => {
    try {
      await AsyncStorage.setItem('password', this.props.password);

      console.log('password saved: ' + this.props.password);
    } catch (error) {
      // Error saving data
    }
  };

  storeUser = async () => {
    try {
      await AsyncStorage.setItem('hasUser', 'true');

      console.log('user saved');
    } catch (error) {
      // Error saving data
    }
  };

  componentDidUpdate(prevProps, nextState) {
    if (
      prevProps.loggedIn != this.props.loggedIn &&
      this.props.loggedIn == true &&
      prevProps.username != this.props.username
    ) {
      console.log('loggedin changed home: ' + this.props.loggedIn);

      //this.props.login(true);

      this.props.getProgressData();

      if (this.props.username) {
        this.storeUsername(this.props.username);
        this.storePassword(this.props.password);
        this.storeUser();
      }
    }
  }

  componentDidMount() {
    //start debug
    // this.props.setIntervalProgress({
    //   highestCompletedIntervalLevel: 1,
    // });

    // this.props.setPitchProgress({
    //   highestCompletedPitchLevel: 1,
    // });

    //end debug

    this.props.getAccess();

    if (this.props.loggedIn) {
      this.props.getProgressData();
    }

    //this.props.getProgressData();

    //return;

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

  showLogin = () => {
    this.props.showLogin();
  };

  upgrade = () => {
    let url = 'http://pianolessonwithwarren.com/memberships/';

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

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

    if (!this.props.loggedIn && level > 1 && this.props.accessFeature > 0) {
      Alert.alert(
        null,
        //`Please log in or join the Premium membership to unlock this level.`,
        `Please log in to play Level ${level}.`,
        [
          {text: 'LOGIN', onPress: () => this.showLogin()},
          //{text: 'JOIN MEMBERSHIP', onPress: () => this.upgrade()},
          {text: 'CANCEL', onPress: () => console.log('OK Pressed')},
        ],
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

        {this.props.mode == 0 ? (
          <MainMenu setMode={this.setMode} />
        ) : this.props.mode == 1 && this.props.level == 0 ? (
          <PitchMenu showLevel={this.showLevel} />
        ) : this.props.mode == 1 && this.props.level > 0 ? (
          <PitchLevels
            level={this.props.level}
            mode={this.props.mode}
            props={this.props}
          />
        ) : this.props.mode == 2 && this.props.level == 0 ? (
          <IntervalMenu showLevel={this.showLevel} />
        ) : this.props.mode == 2 && this.props.level > 0 ? (
          <IntervalLevels
            level={this.props.level}
            mode={this.props.mode}
            props={this.props}
          />
        ) : this.props.mode == 3 ? (
          <SignIn />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    mode: state.mode,
    highestCompletedPitchLevel: state.highestCompletedPitchLevel,
    highestCompletedIntervalLevel: state.highestCompletedIntervalLevel,
    graphStarted: state.graphStarted,
    loggedIn: state.loggedIn,
    username: state.username,
    password: state.password,
    url: state.url,
    accessFeature: state.accessFeature,
  };
};

export default connect(mapStateToProps, {
  setLevel,
  setMode,
  setPitchProgress,
  setIntervalProgress,
  getProgressData,
  manageGraph,
  login,
  showLogin,
  setUsername,
  setDeviceUsername,
  saveTestScore,
  getAccess,
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
