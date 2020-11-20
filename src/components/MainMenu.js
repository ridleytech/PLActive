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

import videoImg from '../../images/instructions-placeholder.png';
import {FlatList, ScrollView} from 'react-native-gesture-handler';

const MainMenu = ({setMode}) => {
  var levels = ['Pitch Recognition', 'Interval Training'];

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
        <Animated.View style={{marginTop: 40, opacity: opacity}}>
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

export default MainMenu;
