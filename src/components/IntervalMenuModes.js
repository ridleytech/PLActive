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
import {FlatList, ScrollView} from 'react-native-gesture-handler';

const IntervalMenuModes = ({showLevel}) => {
  var modes = ['Broken', 'Blocked'];
  const dispatch = useDispatch();

  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  showLevels = (mode) => {
    console.log('show Interval mode: ' + mode);
    dispatch({type: 'SET_INTERVAL_MODE', mode: mode});
  };

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
          Interval Training
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
              marginTop: 10,
              display: 'flex',
              //flexDirection: 'row',
              //backgroundColor: 'yellow',
            }}>
            Both the Blocked and Broken mode must be completed for this Program
            to be marked as completed.
          </Text>
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

export default IntervalMenuModes;
