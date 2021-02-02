import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
  Alert,
} from 'react-native';
import Header from './Header';
import {useSelector, useDispatch} from 'react-redux';
import {getAccess} from '../thunks/';

import videoImg from '../../images/instructions-placeholder.png';
import lockIcon from '../../images/lock-icon.png';
import checkIcon from '../../images/check2.png';

import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {setLevel} from '../actions/';

const IntervalMenuLevels = ({showLevel}) => {
  var levels = [1, 2, 3, 4, 5];

  const loggedIn = useSelector((state) => state.loggedIn);
  const accessFeature = useSelector((state) => state.accessFeature);
  const intervalmode = useSelector((state) => state.intervalmode);
  const dispatch = useDispatch();

  const highestCompletedIntervalLevel = useSelector(
    (state) => state.highestCompletedIntervalLevel,
  );

  const highestCompletedIntervalBlockedLevel = useSelector(
    (state) => state.highestCompletedIntervalBlockedLevel,
  );

  const highestCompletedIntervalBrokenLevel = useSelector(
    (state) => state.highestCompletedIntervalBrokenLevel,
  );
  var modeDisplay;

  if (intervalmode == 1) {
    currentLevel = highestCompletedIntervalBrokenLevel;
    modeDisplay = 'Broken Chords';
  } else {
    currentLevel = highestCompletedIntervalBlockedLevel;
    modeDisplay = 'Broken Chords';
  }

  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  // useEffect(() => {
  //   dispatch(getAccess());
  // }, []);

  const showLogin = () => {
    console.log('showLogin');
    // this.props.showLogin();
    // console.log('showLogin triad');
    dispatch({type: 'SHOW_LOGIN'});
  };

  goToLevel = (level) => {
    console.log('show Interval level: ' + level);
    // dispatch({type: 'SET_TRIAD_MODE', mode: mode});

    if (!loggedIn && level > 1 && accessFeature > 0) {
      Alert.alert(
        null,
        //`Please log in or join the Premium membership to unlock this level.`,
        `Please log in to play Level ${level}.`,
        [
          {text: 'LOGIN', onPress: () => showLogin()},
          //{text: 'JOIN MEMBERSHIP', onPress: () => this.upgrade()},
          {text: 'CANCEL', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );

      return;
    } else {
      if (intervalmode == 1) {
        //check if blocked level is equivalent to go to next level

        console.log(
          'highestCompletedIntervalBrokenLevel: ' +
            highestCompletedIntervalBrokenLevel,
        );

        if (level - 1 > highestCompletedIntervalBrokenLevel) {
          Alert.alert(
            null,
            `Complete level ${
              highestCompletedIntervalBrokenLevel + 1
            } to proceed.`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          return;
        }

        // else if (level - 1 > highestCompletedIntervalBlockedLevel) {
        //   Alert.alert(
        //     null,
        //     `Complete Blocked Chords Level ${
        //       highestCompletedIntervalBlockedLevel + 1
        //     } to proceed.`,
        //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        //     {cancelable: false},
        //   );

        //   return;

        // }
      } else {
        console.log(
          'highestCompletedIntervalBlockedLevel: ' +
            highestCompletedIntervalBlockedLevel,
        );

        if (level - 1 > highestCompletedIntervalBlockedLevel) {
          Alert.alert(
            null,
            `Complete level ${
              highestCompletedIntervalBlockedLevel + 1
            } to proceed.`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );

          return;
        }

        // else if (level - 1 > highestCompletedIntervalBrokenLevel) {
        //   Alert.alert(
        //     null,
        //     `Complete Broken Chords Level ${
        //       highestCompletedIntervalBrokenLevel + 1
        //     } to proceed.`,
        //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        //     {cancelable: false},
        //   );

        //   return;
        // }
      }
    }

    dispatch(setLevel(level));
  };

  return (
    <>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          flex: 1,
        }}>
        <Text
          style={{
            fontFamily: 'Helvetica Neue',
            fontSize: 20,
            fontWeight: 'bold',
            color: '#3AB24A',
          }}>
          Interval Training - {modeDisplay}
        </Text>

        {/* <Image source={videoImg} style={styles.video} /> */}
        <Animated.View style={{marginTop: 30, opacity: opacity}}>
          <View
            style={{
              backgroundColor: '#3AB24A',
              height: 65,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                padding: 20,
                textAlign: 'center',
              }}>
              Choose Level
            </Text>
          </View>

          {/* <FlatList
            style={styles.list}
            data={levels}
            renderItem={listItem}
            keyExtractor={(item, index) => index.toString()}
          /> */}

          <ScrollView style={{height: '100%'}}>
            {levels.map((level, index) => {
              return (
                <>
                  <TouchableOpacity
                    //disabled={index > highestCompletedIntervalLevel ? true : false}
                    onPress={() => {
                      goToLevel(level);
                    }}
                    key={index}>
                    <View
                      style={{
                        backgroundColor: '#F6FA43',
                        height: 65,
                        marginBottom: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          padding: 20,
                          textAlign: 'center',
                        }}>
                        Level {level}
                      </Text>
                    </View>

                    {!loggedIn && accessFeature == 2 ? (
                      <Image
                        source={
                          index < currentLevel
                            ? checkIcon
                            : index > 0
                            ? lockIcon
                            : null
                        }
                        style={{position: 'absolute', right: 12, top: 12}}
                      />
                    ) : (
                      <Image
                        source={index < currentLevel ? checkIcon : null}
                        style={{position: 'absolute', right: 12, top: 12}}
                      />
                    )}
                  </TouchableOpacity>
                </>
              );
            })}
            <View style={{height: 100}} />
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

export default IntervalMenuLevels;
