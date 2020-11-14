import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 12}}>Loading...</Text>
      </View>
    );
  }
}

export default Loading;
