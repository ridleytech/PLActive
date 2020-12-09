import React, {useEffect, useState} from 'react';

import {View, Image, StyleSheet, Dimensions, NativeModules} from 'react-native';

import WhiteIcon from '../../images/blank.jpg';
import GreenIcon from '../../images/blank-green.png';
import BlackIcon from '../../images/black.png';
import BlackGreenIcon from '../../images/black-green.png';

var testView = NativeModules.PlayKey;

const KeyboardViewScroll = () => {
  const [keyStates, setKeyStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const pressKey = (key: number) => {
    console.log('key: ' + key);

    var sc = keyStates.slice();

    sc[key] = true;
    setKeyStates(sc);

    if (Platform.OS === 'ios') {
      testView.playKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      //console.log("android down")

      //testView.playKey(key);

      testView.playKeyCB(
        key,
        (msg) => {
          console.log('error: ' + msg);
        },
        (response) => {
          console.log('response: ' + response);
        },
      );
    }
  };

  const releaseKey = (key: number) => {
    var sc = keyStates.slice();

    sc[key] = false;
    setKeyStates(sc);

    if (Platform.OS === 'ios') {
      testView.releaseKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      //testView.releaseKey(key);

      //console.log("android up")

      // testView.releaseKey(
      //     key,
      //     (msg) => {
      //       console.log('error: ' + msg);
      //     },
      //     (response) => {
      //       console.log('response: ' + response);
      //     },
      //   );

      testView.releaseKey(key);
    }
  };

  return (
    <View
      style={{
        //backgroundColor: 'blue',
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        //bottom: 100,
      }}>
      <View
        onTouchStart={() => pressKey(0)}
        onTouchEnd={() => releaseKey(0)}
        style={[styles.whiteKey]}>
        <Image
          source={keyStates[0] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(1)}
        onTouchEnd={() => releaseKey(1)}
        style={styles.blackKey2}>
        <Image source={keyStates[1] ? BlackGreenIcon : BlackIcon} />
      </View>
      <View
        onTouchStart={() => pressKey(2)}
        onTouchEnd={() => releaseKey(2)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[2] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(3)}
        onTouchEnd={() => releaseKey(3)}
        style={styles.blackKey3}>
        <Image source={keyStates[3] ? BlackGreenIcon : BlackIcon} />
      </View>
      <View
        onTouchStart={() => pressKey(4)}
        onTouchEnd={() => releaseKey(4)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[4] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(5)}
        onTouchEnd={() => releaseKey(5)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[5] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(6)}
        onTouchEnd={() => releaseKey(6)}
        style={styles.blackKey4}>
        <Image source={keyStates[6] ? BlackGreenIcon : BlackIcon} />
      </View>
      <View
        onTouchStart={() => pressKey(7)}
        onTouchEnd={() => releaseKey(7)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[7] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(8)}
        onTouchEnd={() => releaseKey(8)}
        style={styles.blackKey5}>
        <Image source={keyStates[8] ? BlackGreenIcon : BlackIcon} />
      </View>
      <View
        onTouchStart={() => pressKey(9)}
        onTouchEnd={() => releaseKey(9)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[9] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
      <View
        onTouchStart={() => pressKey(10)}
        onTouchEnd={() => releaseKey(10)}
        style={styles.blackKey6}>
        <Image source={keyStates[10] ? BlackGreenIcon : BlackIcon} />
      </View>
      <View
        onTouchStart={() => pressKey(11)}
        onTouchEnd={() => releaseKey(11)}
        style={styles.whiteKey}>
        <Image
          source={keyStates[11] ? GreenIcon : WhiteIcon}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

export default KeyboardViewScroll;

let offset = Dimensions.get('screen').width / 9.2;

let whiteKeyWidth = Dimensions.get('screen').width / 7;
let blackKeyWidth = Dimensions.get('screen').width / 13;

//console.log('white key width kb1: ' + whiteKeyWidth);

const styles = StyleSheet.create({
  mainContainer: {
    //backgroundColor: 'yellow',
    //position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
  },
  checkbox: {
    alignSelf: 'center',
  },
  icon: {
    height: '100%',
    maxHeight: 250,
    width: whiteKeyWidth,
  },
  whiteKey: {
    height: '100%',
    maxHeight: 250,
    marginRight: 0.5,
    //backgroundColor: 'purple',
  },
  blackKey: {position: 'absolute', zIndex: 1},
  blackKey2: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    //backgroundColor: 'red',
    left: offset,
  },
  blackKey3: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth,
  },
  blackKey4: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 3,
  },
  blackKey5: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 4,
  },
  blackKey6: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 5,
  },
});
