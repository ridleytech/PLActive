import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';

import videoImg from '../../images/instructions-placeholder.png';
import check from '../../images/check.png';

const Instructions = ({
  correctAnswers,
  total,
  startQuiz,
  instructions,
  level,
}) => {
  //console.log('instructions level: ' + level);
  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  return (
    <>
      <View style={{padding: 20, backgroundColor: 'white', height: 1000}}>
        <Text
          style={{
            fontFamily: 'Helvetica Neue',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Quiz - Interval Training Level {level}
        </Text>

        <Image source={videoImg} style={styles.video} />

        <Text
          style={{
            fontFamily: 'Helvetica Neue',
            fontSize: 15,
            marginTop: 15,
            fontWeight: 'bold',
            color: '#3AB24A',
          }}>
          Instructions
        </Text>

        <Animated.View
          style={{
            paddingLeft: 5,
            marginTop: 15,
            paddingRight: 25,
            opacity: opacity,
          }}>
          {instructions.map((text, index) => {
            if (index < 3) {
              return (
                <View style={styles.listItem} key={index}>
                  <Image source={check} style={styles.check} />
                  <Text style={[styles.list]}>{instructions[index]}</Text>
                </View>
              );
            } else {
              return (
                <View style={styles.listItem} key={index}>
                  <Image source={check} style={styles.check} />
                  <Text style={[styles.list, {fontWeight: 'bold'}]}>
                    {instructions[index]}
                  </Text>
                </View>
              );
            }
          })}
        </Animated.View>
      </View>
      <TouchableOpacity
        onPress={() => startQuiz()}
        style={{
          height: 60,
          backgroundColor: '#3AB24A',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'Helvetica Neue',
            fontWeight: 'bold',
            color: 'white',
          }}>
          START QUIZ
        </Text>
      </TouchableOpacity>
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

export default Instructions;
