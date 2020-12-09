import React, {useEffect, useState} from 'react';

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  NativeModules,
  Text,
} from 'react-native';

import WhiteIcon from '../../images/blank.jpg';
import GreenIcon from '../../images/blank-green.png';
import BlackIcon from '../../images/black.png';
import BlackGreenIcon from '../../images/black-green.png';

var testView = NativeModules.PlayKey;

const KeyboardView2 = () => {
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
    <>
      <View
        style={{
          backgroundColor: 'black',
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

        <View
          onTouchStart={() => pressKey(12)}
          onTouchEnd={() => releaseKey(12)}
          style={[styles.whiteKey]}>
          <Image
            source={keyStates[12] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(13)}
          onTouchEnd={() => releaseKey(13)}
          style={styles.blackKey7}>
          <Image source={keyStates[13] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(14)}
          onTouchEnd={() => releaseKey(14)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[14] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(15)}
          onTouchEnd={() => releaseKey(15)}
          style={styles.blackKey8}>
          <Image source={keyStates[15] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(16)}
          onTouchEnd={() => releaseKey(16)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[16] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(17)}
          onTouchEnd={() => releaseKey(17)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[17] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(18)}
          onTouchEnd={() => releaseKey(18)}
          style={styles.blackKey9}>
          <Image source={keyStates[18] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(19)}
          onTouchEnd={() => releaseKey(19)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[19] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(20)}
          onTouchEnd={() => releaseKey(20)}
          style={styles.blackKey10}>
          <Image source={keyStates[20] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(21)}
          onTouchEnd={() => releaseKey(21)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[21] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(22)}
          onTouchEnd={() => releaseKey(22)}
          style={styles.blackKey11}>
          <Image source={keyStates[22] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(23)}
          onTouchEnd={() => releaseKey(23)}
          style={styles.whiteKey}>
          <Image
            source={keyStates[23] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(24)}
          onTouchEnd={() => releaseKey(24)}
          style={[styles.whiteKey]}>
          <Image
            source={keyStates[24] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
        <View
          onTouchStart={() => pressKey(25)}
          onTouchEnd={() => releaseKey(25)}
          style={styles.blackKey12}>
          <Image source={keyStates[25] ? BlackGreenIcon : BlackIcon} />
        </View>
        <View
          onTouchStart={() => pressKey(26)}
          onTouchEnd={() => releaseKey(26)}
          style={[styles.whiteKey]}>
          <Image
            source={keyStates[26] ? GreenIcon : WhiteIcon}
            style={styles.icon}
          />
        </View>
      </View>
    </>
  );
};

export default KeyboardView2;

let offset = Dimensions.get('screen').width / 17;

var whiteKeyWidth = Dimensions.get('screen').width / 14;
var blackKeyWidth = Dimensions.get('screen').width / 12;

var a = 0.9;
var b = 0;

if (whiteKeyWidth > 70) {
  whiteKeyWidth = whiteKeyWidth * a;
  blackKeyWidth = blackKeyWidth * a;
  offset = offset * a;
}

// console.log('white key width kb2: ' + whiteKeyWidth);
// console.log('black key width kb2: ' + blackKeyWidth);

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
    width: whiteKeyWidth,
  },
  blackKey2: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset,
    //backgroundColor: 'red',
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

  blackKey7: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 7,
  },
  blackKey8: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 8,
  },
  blackKey9: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 10,
  },
  blackKey10: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 11,
  },
  blackKey11: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 12,
  },
  blackKey12: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 14,
  },
});
