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
//import IntervalMenu from './IntervalMenu';
import {
  setLevel,
  setMode,
  setIntervalBrokenProgress,
  setIntervalBlockedProgress,
  setPitchProgress,
  setTriadsProgress,
  setTriadsBrokenProgress,
  setTriadsBlockedProgress,
  manageGraph,
  login,
  showLogin,
  setUsername,
  setDeviceUsername,
  setUserID,
} from '../actions/';
import {
  getProgressData,
  saveTestScore,
  getAccess,
  userAuth,
  saveProgress,
} from '../thunks/';
import IntervalLevels from './IntervalLevels';
import IntervalMenuModes from './IntervalMenuModes';
import IntervalMenuLevels from './IntervalMenuLevels';
import PitchLevels from './PitchLevels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import TriadsLevels from './TriadsLevels';
import TriadsMenuModes from './TriadsMenuModes';
import TriadsMenuLevels from './TriadsMenuLevels';
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
        this.storePitchData(value);
      }

      this.props.setPitchProgress({
        highestCompletedPitchLevel: value,
      });
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem(
        'highestCompletedIntervalBrokenLevel',
      );

      if (value2 !== null) {
        // We have data!!
        console.log(`highestCompletedIntervalBrokenLevel: ${value2}`);
      } else {
        //console.log('save default interval data');

        value2 = 0;
        this.storeIntervalDataBroken(value2);
      }

      this.props.setIntervalBrokenProgress({
        highestCompletedIntervalBrokenLevel: value2,
      });
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem(
        'highestCompletedIntervalBlockedLevel',
      );

      if (value2 !== null) {
        // We have data!!
        console.log(`highestCompletedIntervalBlockedLevel: ${value2}`);
      } else {
        //console.log('save default interval data');

        value2 = 0;
        this.storeIntervalDataBroken(value2);
      }

      this.props.setIntervalBlockedProgress({
        highestCompletedIntervalBlockedLevel: value2,
      });
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value3 = await AsyncStorage.getItem(
        'highestCompletedTriadsLevelBlocked',
      );

      if (value3 !== null) {
        // We have data!!
        console.log(`highestCompletedTriadsLevelBlocked: ${value3}`);
      } else {
        //console.log('save default interval data');

        value3 = 0;
        this.storeTriadsDataBlocked(value3);
      }

      this.props.setTriadsProgressBlocked({
        highestCompletedTriadsLevelBlocked: value3,
      });
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value4 = await AsyncStorage.getItem(
        'highestCompletedTriadsLevelBroken',
      );

      if (value4 !== null) {
        // We have data!!
        console.log(`highestCompletedTriadsLevelBroken: ${value4}`);
      } else {
        //console.log('save default interval data');

        value4 = 0;
        this.storeTriadsDataBroken(value4);
      }

      this.props.setTriadsProgressBroken({
        highestCompletedTriadsLevelBroken: value4,
      });
    } catch (error) {
      // Error retrieving data
    }

    //reset progress data
    // this.storePitchData();
    // this.storeIntervalDataBroken();
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

  storePitchData = async (val) => {
    try {
      await AsyncStorage.setItem('highestCompletedPitchLevel', val.toString());

      console.log('pitch saved storage: ' + val);
    } catch (error) {
      // Error saving data
    }
  };

  storeIntervalDataBroken = async (val) => {
    try {
      await AsyncStorage.setItem(
        'highestCompletedIntervalBrokenLevel',
        val.toString(),
      );
      console.log('interval broken saved storage: ' + val);
    } catch (error) {
      // Error saving data
    }
  };

  storeIntervalDataBlocked = async (val) => {
    try {
      await AsyncStorage.setItem(
        'highestCompletedIntervalBlockedLevel',
        val.toString(),
      );
      console.log('interval blocked saved storage: ' + val);
    } catch (error) {
      // Error saving data
    }
  };

  storeTriadsDataBlocked = async (val) => {
    try {
      await AsyncStorage.setItem(
        'highestCompletedTriadsLevelBlocked',
        val.toString(),
      );
      console.log('triads blocked saved storage: ' + val);
    } catch (error) {
      // Error saving data
    }
  };

  storeTriadsDataBroken = async (val) => {
    try {
      await AsyncStorage.setItem(
        'highestCompletedTriadsLevelBroken',
        val.toString(),
      );
      console.log('triads broken saved storage: ' + val);
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
      var value2 = await AsyncStorage.getItem('userid');

      if (value2 !== null) {
        // We have data!!
        console.log(`retrieved userid: ${value2}`);

        this.props.setUserID(parseInt(value2));

        this.setState({
          useridVal: value2,
        });
      } else {
        console.log('no userid');

        this.setState({
          useridVal: null,
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
            console.log('save default data new user');

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

  storeUserid = async () => {
    try {
      await AsyncStorage.setItem('userid', this.props.userid.toString());

      console.log('userid saved: ' + this.props.userid);
    } catch (error) {
      // Error saving data
    }
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

  saveP = () => {
    this.props.saveProgress();
  };

  componentDidUpdate(prevProps, nextState) {
    if (
      prevProps.loggedIn != this.props.loggedIn &&
      this.props.loggedIn == true &&
      prevProps.username != this.props.username
    ) {
      console.log('loggedin changed home: ' + this.props.loggedIn);

      //this.props.login(true);

      this.props.userAuth();
      //this.props.getProgressData();

      if (this.props.username) {
        this.storeUsername();
        this.storePassword();
        this.storeUser();
      }
    }

    if (prevProps.userid != this.props.userid && this.props.userid) {
      this.props.getProgressData();
      this.storeUserid();
    }

    if (prevProps.latestVersion != this.props.latestVersion) {
      console.log(
        'check version latest: ' +
          this.props.latestVersion +
          ' current: ' +
          parseFloat(this.props.currentVersion),
      );

      if (parseFloat(this.props.currentVersion) < this.props.latestVersion) {
        var msg;

        msg = `UPDATE`;

        Alert.alert(
          null,
          //`Please log in or join the Premium membership to unlock this level.`,
          `New version of Active Ear is now available.`,
          [
            {text: msg, onPress: () => this.appStore()},
            //{text: 'JOIN MEMBERSHIP', onPress: () => this.upgrade()},
            {text: 'CANCEL', onPress: () => {}},
          ],
          {cancelable: false},
        );
      }
    }

    if (prevProps.hasProgress != this.props.hasProgress && this.props.userid) {
      console.log('hasProgress changed');

      this.storePitchData(this.props.highestCompletedPitchLevel.toString());
      this.storeIntervalDataBroken(
        this.props.highestCompletedIntervalBrokenLevel.toString(),
      );

      this.storeIntervalDataBlocked(
        this.props.highestCompletedIntervalBlockedLevel.toString(),
      );
    }
  }

  componentDidMount() {
    //start debug
    // this.props.setIntervalProgress({
    //   highestCompletedIntervalBrokenLevel: 5,
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
    console.log('showLogin');
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

  appStore = () => {
    var url;

    //https://play.google.com/store/apps/details?id=com.pianolessons

    if (Platform.OS === 'ios') {
      url = 'itms-apps://apple.com/app/id1541508221';
    } else {
      url = 'https://play.google.com/store/apps/details?id=com.pianolessons';
      //url = 'market://details?gotohome=com.pianolessons';
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  setMode = (mode) => {
    console.log('setMode: ' + mode);

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
      } else if (this.props.mode == 2) {
        if (level - 1 > this.props.highestCompletedIntervalBrokenLevel) {
          Alert.alert(
            null,
            `Complete level ${
              this.props.highestCompletedIntervalBrokenLevel + 1
            } to proceed`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          return;
        }
      } else {
        if (level - 1 > this.props.highestCompletedTriadsLevel) {
          Alert.alert(
            null,
            `Complete level ${
              this.props.highestCompletedTriadsLevel + 1
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
        ) : this.props.mode == 2 &&
          this.props.level == 0 &&
          this.props.intervalmode == 0 ? (
          <IntervalMenuModes showLevel={this.showLevel} />
        ) : this.props.mode == 2 && this.props.level == 0 ? (
          <IntervalMenuLevels showLevel={this.showLevel} />
        ) : this.props.mode == 2 && this.props.level > 0 ? (
          <IntervalLevels
            level={this.props.level}
            mode={this.props.mode}
            props={this.props}
          />
        ) : this.props.mode == 3 &&
          this.props.level == 0 &&
          this.props.triadmode == 0 ? (
          <TriadsMenuModes showLevel={this.showLevel} />
        ) : this.props.mode == 3 && this.props.level == 0 ? (
          <TriadsMenuLevels showLevel={this.showLevel} />
        ) : this.props.mode == 3 && this.props.level > 0 ? (
          <TriadsLevels
            level={this.props.level}
            mode={this.props.mode}
            //triadmode={this.props.triadmode}
            props={this.props}
          />
        ) : this.props.mode == 4 ? (
          <SignIn />
        ) : null}

        {/* <TouchableOpacity onPress={() => this.appStore()}>
          <Text style={{height: 50}}>App Store</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity onPress={() => this.saveP()}>
          <Text style={{height: 50}}>Debug Progress</Text>
        </TouchableOpacity> */}
        {/* <Footer /> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    level: state.level,
    mode: state.mode,
    triadmode: state.triadmode,
    intervalmode: state.intervalmode,
    highestCompletedPitchLevel: state.highestCompletedPitchLevel,
    highestCompletedIntervalBrokenLevel:
      state.highestCompletedIntervalBrokenLevel,
    highestCompletedIntervalBlockedLevel:
      state.highestCompletedIntervalBlockedLevel,
    highestCompletedTriadsLevel: state.highestCompletedTriadsLevel,
    graphStarted: state.graphStarted,
    loggedIn: state.loggedIn,
    username: state.username,
    password: state.password,
    url: state.url,
    accessFeature: state.accessFeature,
    latestVersion: state.latestVersion,
    currentVersion: state.currentVersion,
    userid: state.userid,
    hasProgress: state.hasProgress,
  };
};

export default connect(mapStateToProps, {
  setLevel,
  setMode,
  setPitchProgress,
  setIntervalBrokenProgress,
  setIntervalBlockedProgress,
  setTriadsBrokenProgress,
  setTriadsBlockedProgress,
  setTriadsProgress,
  getProgressData,
  manageGraph,
  login,
  showLogin,
  setUsername,
  setDeviceUsername,
  saveTestScore,
  getAccess,
  userAuth,
  setUserID,
  saveProgress,
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
