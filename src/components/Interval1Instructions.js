import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

import videoImg from '../../images/instructions-placeholder.png';
import check from '../../images/check.png';
import TestMidi from './TestMidi';

const Interval1Instructions = ({correctAnswers, total, startQuiz}) => {
  return (
    <>
      <View style={{padding: 20}}>
        <Text
          style={{
            fontFamily: 'Helvetica Neue',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Quiz - Interval Training
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
          {' '}
          Instructions
        </Text>

        <View style={{paddingLeft: 5, marginTop: 15, paddingRight: 25}}>
          <View style={styles.listItem}>
            <Image source={check} style={styles.check} />
            <Text style={styles.list}>
              For this quiz, find the interval distance between 2 notes.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Image source={check} style={styles.check} />
            <Text style={styles.list}>
              This level will consist of 7 multiple choice questions.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Image source={check} style={styles.check} />
            <Text style={styles.list}>
              You need to score a 6/7 to past the quiz.
            </Text>
          </View>

          <View style={styles.listItem}>
            <Image source={check} style={styles.check} />
            <Text style={[styles.list, {fontWeight: 'bold'}]}>
              This quiz should be completed using ONLY your ear. No keyboard.
            </Text>
          </View>
        </View>
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

export default Interval1Instructions;
