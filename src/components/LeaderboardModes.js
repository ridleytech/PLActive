import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
  Linking,
} from 'react-native';
import Header from './Header';
import {useSelector, useDispatch} from 'react-redux';

import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';

const LeaderboardModes = ({setMode}) => {
  var levels = [
    'Pitch Recognition',
    'Interval Training',
    'Triads and Sevenths',
    'Bassline Training',
    'Progression Training',
  ];

  const loggedIn = useSelector((state) => state.loggedIn);
  const accessFeature = useSelector((state) => state.accessFeature);
  const dispatch = useDispatch();

  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    console.log('leaderboard main menu load');

    dispatch({type: 'RESET_LEADER_DATA'});
  }, []);

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

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
          Leaderboards
        </Text>
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
              Choose Program
            </Text>
          </View>

          <ScrollView style={{height: '100%'}}>
            {levels.map((level, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setMode(index + 1);
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
                      {level}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={{height: 270}} />
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

export default LeaderboardModes;
