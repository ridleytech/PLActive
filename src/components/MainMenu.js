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
import Hyperlink from 'react-native-hyperlink';
import {useSelector, useDispatch} from 'react-redux';

import videoImg from '../../images/instructions-placeholder.png';
import checkIcon from '../../images/check2.png';

import {FlatList, ScrollView} from 'react-native-gesture-handler';

const MainMenu = ({setMode}) => {
  var levels = [
    'Pitch Recognition',
    'Interval Training',
    'Triads and Sevenths',
  ];

  const loggedIn = useSelector((state) => state.loggedIn);
  const accessFeature = useSelector((state) => state.accessFeature);
  const highestCompletedPitchLevel = useSelector(
    (state) => state.highestCompletedPitchLevel,
  );
  const highestCompletedIntervalLevel = useSelector(
    (state) => state.highestCompletedIntervalLevel,
  );
  const highestCompletedTriadsBlockedLevel = useSelector(
    (state) => state.highestCompletedTriadsBlockedLevel,
  );
  const highestCompletedTriadsBrokenLevel = useSelector(
    (state) => state.highestCompletedTriadsBrokenLevel,
  );

  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  const listItem = (level) => {
    console.log('level: ' + JSON.stringify(level.item));
    return (
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
          Level {level.item}
        </Text>
      </View>
    );
  };

  viewCourse = () => {
    let url =
      'https://pianolessonwithwarren.com/courses/the-ear-training-regimen-for-beginners-and-intermediates/';

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
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
          Active Ear Programs
        </Text>

        <View
          style={{
            marginTop: 10,
            display: 'flex',
            //flexDirection: 'row',
            //backgroundColor: 'yellow',
          }}>
          <Hyperlink
            linkDefault
            linkStyle={{color: '#3AB24A', fontSize: 15}}
            linkText="Click here">
            <Text style={{fontSize: 15}}>
              For More Detail on these exercises, visit the full course
              https://pianolessonwithwarren.com/courses/the-ear-training-regimen-for-beginners-and-intermediates/.
            </Text>
          </Hyperlink>
        </View>
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
              Choose Program
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
              var icon;

              if (index == 0) {
                if (highestCompletedPitchLevel < 3) {
                  icon = null;
                } else {
                  icon = checkIcon;
                }
              } else if (index == 1) {
                if (highestCompletedIntervalLevel < 5) {
                  icon = null;
                } else {
                  icon = checkIcon;
                }
              } else if (index == 2) {
                if (
                  highestCompletedTriadsBlockedLevel < 10 ||
                  highestCompletedTriadsBrokenLevel < 10
                ) {
                  icon = null;
                } else {
                  icon = checkIcon;
                }
              }

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

                  {loggedIn && accessFeature == 2 ? (
                    <Image
                      source={icon}
                      style={{position: 'absolute', right: 12, top: 12}}
                    />
                  ) : (
                    <Image
                      source={
                        index < highestCompletedPitchLevel ? checkIcon : null
                      }
                      style={{position: 'absolute', right: 12, top: 12}}
                    />
                  )}
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

export default MainMenu;
