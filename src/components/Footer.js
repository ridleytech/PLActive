import React, {Component, useState} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';

class Footer extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <>
        <View style={{padding: 5, backgroundColor: 'rgba(255, 255, 255, 1)'}}>
          <Text style={{}}>Version {this.props.currentVersion}</Text>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentVersion: state.currentVersion,
  };
};

export default connect(mapStateToProps, {})(Footer);
