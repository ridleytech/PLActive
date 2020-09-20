import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import Header from './Header';

import videoImg from '../../images/instructions-placeholder.png';

const Menu = ({showLevel}) => {
  return (
    <>
      {/* <Header /> */}
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: 'white',
          height: 1000,
        }}>
        <Image source={videoImg} style={styles.video} />

        <View style={{marginTop: 25}}>
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
              Interval Training
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              showLevel(1);
            }}>
            <View
              style={{
                backgroundColor: '#F6FA43',
                height: 65,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  padding: 20,
                  textAlign: 'center',
                }}>
                Level 1
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showLevel(2);
            }}>
            <View
              style={{
                backgroundColor: '#F6FA43',
                height: 65,

                marginTop: 3,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  padding: 20,
                  textAlign: 'center',
                }}>
                Level 2
              </Text>
            </View>
          </TouchableOpacity>
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
