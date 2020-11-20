import React, {Component} from 'react';
import {View, TextInput, Image, Animated, Keyboard} from 'react-native';
import styles, {IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL} from './styles';
import logo from '../../images/logo.png';

class Demo extends Component {
  constructor(props) {
    super(props);

    this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }

  UNSAFE_componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  UNSAFE_componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    console.log('show 2');
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }),
      // Animated.timing(this.imageHeight, {
      //   duration: event.duration,
      //   toValue: IMAGE_HEIGHT_SMALL,
      //   useNativeDriver: false,
      // }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }),
      // Animated.timing(this.imageHeight, {
      //   duration: event.duration,
      //   toValue: IMAGE_HEIGHT,
      //   useNativeDriver: false,
      // }),
    ]).start();
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, {paddingBottom: this.keyboardHeight}]}>
        <Animated.Image
          source={logo}
          style={[styles.logo, {height: this.imageHeight}]}
        />
        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Username" style={styles.input} />
        <TextInput placeholder="Password" style={styles.input} />
        <TextInput placeholder="Confirm Password" style={styles.input} />
      </Animated.View>
    );
  }
}

export default Demo;
