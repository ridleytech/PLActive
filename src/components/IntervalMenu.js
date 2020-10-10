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
import {useSelector} from 'react-redux';

import videoImg from '../../images/instructions-placeholder.png';
import lockIcon from '../../images/lock-icon.png';
import checkIcon from '../../images/check2.png';

import {FlatList, ScrollView} from 'react-native-gesture-handler';

const IntervalMenu = ({showLevel}) => {
  var levels = [1, 2, 3, 4, 5];

  const isTrial = useSelector((state) => state.isTrial);
  const highestCompletedIntervalLevel = useSelector(
    (state) => state.highestCompletedIntervalLevel,
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
          }}>
          Interval Training
        </Text>
        <Image source={videoImg} style={styles.video} />
        <Animated.View style={{marginTop: 20, opacity: opacity}}>
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

          <ScrollView style={{maxHeight: 290}}>
            {levels.map((level, index) => {
              return (
                <TouchableOpacity
                  //disabled={index > highestCompletedIntervalLevel ? true : false}
                  onPress={() => {
                    showLevel(level);
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

                  {isTrial ? (
                    <Image
                    source={index < highestCompletedIntervalLevel
                      ? checkIcon : index > 0
                      ? lockIcon
                      : null}
                      style={{position: 'absolute', right: 12, top: 12}}
                    />
                  ) : (

                    <Image
                      source={
                        index < highestCompletedIntervalLevel
                          ? checkIcon
                          : null
                      }
                      style={{position: 'absolute', right: 12, top: 12}}
                    />

                    // <Image
                    //   source={
                    //     index < highestCompletedIntervalLevel
                    //       ? checkIcon
                    //       : index > highestCompletedIntervalLevel
                    //       ? lockIcon
                    //       : null
                    //   }
                    //   style={{position: 'absolute', right: 12, top: 12}}
                    // />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    marginBottom: 8,
  },
  listItem: {display: 'flex', flexDirection: 'row'},
  video: {marginTop: 20, width: '100%'},
  check: {marginRight: 8},
});

export default IntervalMenu;
