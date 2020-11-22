import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Helvetica Neue',
            fontWeight: 'bold',
          }}>
          Loading...
        </Text>
      </View>
    );
  }
}

export default Loading;
