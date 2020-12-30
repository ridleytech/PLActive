import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import Header from './Header';
import {useSelector, useDispatch} from 'react-redux';
import {getAccess} from '../thunks/';

import videoImg from '../../images/instructions-placeholder.png';
import lockIcon from '../../images/lock-icon.png';
import checkIcon from '../../images/check2.png';

import {FlatList, ScrollView} from 'react-native-gesture-handler';

const TriadsMenuModes = ({showLevel}) => {
  var modes = ['Broken', 'Blocked'];

  const loggedIn = useSelector((state) => state.loggedIn);
  const accessFeature = useSelector((state) => state.accessFeature);
  const dispatch = useDispatch();

  const highestCompletedTriadsLevel = useSelector(
    (state) => state.highestCompletedTriadsLevel,
  );

  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  showLevels = (mode) => {
    console.log('show triads mode: ' + mode);
    dispatch({type: 'SET_TRIAD_MODE', mode: mode});
  };

  // useEffect(() => {
  //   dispatch(getAccess());
  // }, []);

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
          Triad and Sevenths Training
        </Text>

        <View
          style={{
            marginTop: 10,
            display: 'flex',
            //flexDirection: 'row',
            //backgroundColor: 'yellow',
          }}>
          <Text>Select your mode of exercise below.</Text>
          <Text
            style={{
              color: 'red',
              fontWeight: 'bold',
              fontSize: 13,
              marginTop: 5,
            }}>
            We Recommend doing the broken chords first.
          </Text>
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
            {modes.map((level, index) => {
              return (
                <>
                  <TouchableOpacity
                    //disabled={index > highestCompletedTriadsLevel ? true : false}
                    onPress={() => {
                      showLevels(index + 1);
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

                    {/* {!loggedIn && accessFeature == 2 ? (
                      <Image
                        source={
                          index < highestCompletedTriadsLevel
                            ? checkIcon
                            : index > 0
                            ? lockIcon
                            : null
                        }
                        style={{position: 'absolute', right: 12, top: 12}}
                      />
                    ) : (
                      <Image
                        source={
                          index < highestCompletedTriadsLevel ? checkIcon : null
                        }
                        style={{position: 'absolute', right: 12, top: 12}}
                      />
                    )} */}
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

export default TriadsMenuModes;
