import React, {Component, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
  Alert,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';

import {setLevel} from '../actions';
import {loginUser} from '../thunks';

class SignIn extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  login = () => {
    console.log('login');
    //this.props.loginUser();
  };

  render() {
    return (
      <>
        <SafeAreaView />

        <Text>Username</Text>
        <TextInput />
        <Text>Password</Text>
        <TextInput />

        <TouchableOpacity onPress={this.login}>
          <Text>Log In</Text>
        </TouchableOpacity>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
  };
};

export default connect(mapStateToProps, {
  loginUser,
})(SignIn);

const styles = StyleSheet.create({
  textHeaderLbl: {},
  inputText: {},
});
