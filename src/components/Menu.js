import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import Header from './Header';

import videoImg from '../../images/instructions-placeholder.png';
import {ScrollView} from 'react-native-gesture-handler';

const Menu = ({showLevel}) => {
  var levels = [1, 2, 3, 4, 5];
  return (
    <>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          height: 1000,
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

        <View style={{marginTop: 20}}>
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
          <ScrollView style={{height: 280}}>
            {levels.map((level, index) => {
              return (
                <TouchableOpacity
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
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
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

export default Menu;
