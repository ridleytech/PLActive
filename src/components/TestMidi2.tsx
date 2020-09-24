import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  Image,
} from 'react-native';

var testView = NativeModules.PlayKey;

import WhiteIcon from '../../images/blank.jpg';
import BlackIcon from '../../images/black.png';

class TestMidi2 extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  pressKey(key: number): void {
    console.log('pressKey: ' + key);

    //testView.playKey(key);

    // testView.playKeyCB(
    //   key,
    //   (msg) => {
    //     console.log('error: ' + msg);
    //   },
    //   (response) => {
    //     console.log('response: ' + response);
    //   },
    // );

    testView.playKey(key).then((result) => {
      console.log('show', result);
    });
  }

  releaseKey(key: number): void {
    //console.log('releaseKey');

    //testView.releaseKey(key);

    testView.releaseKey(key).then((result) => {
      //console.log('show', result);
    });
  }

  componentDidMount() {
    // testView.initGraph(
    //   (msg) => {
    //     console.log('error: ' + msg);
    //   },
    //   (response) => {
    //     console.log('response: ' + response);
    //   },
    // );
    testView.initGraph('url').then((result) => {
      console.log('show', result);
    });
  }

  renderInitialView() {}

  render() {
    return (
      <>
        <View style={styles.whiteKeys}>
          <View
            onTouchStart={() => this.pressKey(0)}
            onTouchEnd={() => this.releaseKey(0)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            style={styles.icon2}
            onTouchStart={() => this.pressKey(1)}
            onTouchEnd={() => this.releaseKey(1)}>
            <TouchableOpacity>
              <Image source={BlackIcon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(2)}
            onTouchEnd={() => this.releaseKey(2)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(3)}
            onTouchEnd={() => this.releaseKey(3)}
            style={styles.icon3}>
            <TouchableOpacity>
              <Image source={BlackIcon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(4)}
            onTouchEnd={() => this.releaseKey(4)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(5)}
            onTouchEnd={() => this.releaseKey(5)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(6)}
            onTouchEnd={() => this.releaseKey(6)}
            style={styles.icon4}>
            <TouchableOpacity>
              <Image source={BlackIcon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(7)}
            onTouchEnd={() => this.releaseKey(7)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(8)}
            onTouchEnd={() => this.releaseKey(8)}
            style={styles.icon5}>
            <TouchableOpacity>
              <Image source={BlackIcon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(9)}
            onTouchEnd={() => this.releaseKey(9)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(10)}
            onTouchEnd={() => this.releaseKey(10)}
            style={styles.icon6}>
            <TouchableOpacity>
              <Image source={BlackIcon} />
            </TouchableOpacity>
          </View>

          <View
            onTouchStart={() => this.pressKey(11)}
            onTouchEnd={() => this.releaseKey(11)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
          {/* <View
            onTouchStart={() => this.pressKey(12)}
            onTouchEnd={() => this.releaseKey(12)}>
            <TouchableOpacity>
              <Image source={WhiteIcon} style={styles.icon} />
            </TouchableOpacity>
          </View> */}
        </View>
      </>
    );
  }
}

export default TestMidi2;

let offset = 43;

const styles = StyleSheet.create({
  whiteKeys: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  blackKeys: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon2: {
    position: 'absolute',
    left: 30 + offset,
    zIndex: 1,
  },
  icon3: {
    position: 'absolute',
    left: 78 + offset,
    zIndex: 1,
  },
  icon4: {
    position: 'absolute',
    left: 173 + offset,
    zIndex: 1,
  },
  icon5: {
    position: 'absolute',
    left: 222 + offset,
    zIndex: 1,
  },
  icon6: {
    position: 'absolute',
    left: 270 + offset,
    zIndex: 1,
  },
});
