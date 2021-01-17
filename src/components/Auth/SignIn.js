import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {manageLogin, login} from '../../actions';
import {loginUser} from '../../thunks';

class SignIn extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  state = {
    myInformation: {},
    usernameVal: '',
    passwordVal: '',
    phone: null,
  };

  authUserDebug = () => {
    console.log('authUser');

    this.setState({
      user: {username: 'ridley1224'},
    });

    this.props.authUser(this.state.myInformation);
  };

  changeVal = (val) => {
    if (val) {
      this.setState({
        usernameVal: val,
      });
    } else {
      this.setState({
        usernameVal: '',
      });
    }
  };

  changeVal2 = (val) => {
    if (val) {
      this.setState({
        passwordVal: val,
      });
    } else {
      this.setState({
        passwordVal: '',
      });
    }
  };

  login = () => {
    if (!this.state.usernameVal) {
      Alert.alert(
        null,
        `Please enter username.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    if (!this.state.passwordVal) {
      Alert.alert(
        null,
        `Please enter password.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }

    //console.log('login');
    this.props.manageLogin(false);
    this.props.loginUser(this.state.usernameVal, this.state.passwordVal);
  };

  join = () => {
    let url = 'http://pianolessonwithwarren.com/memberships/';

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  componentDidUpdate(prevProps, nextState) {
    if (this.props.loggedIn != prevProps.loggedIn) {
      console.log('login changed on signin screen');
    }
  }

  render() {
    return (
      <>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={styles.content}>
            <ScrollView>
              <Text style={[styles.txtHeader, {marginTop: 20}]}>Username</Text>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                style={styles.inputTxt}
                value={this.state.usernameVal}
                onChangeText={(text) => this.changeVal(text)}></TextInput>
              <Text style={styles.txtHeader}>Password</Text>
              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                secureTextEntry={true}
                style={styles.inputTxt}
                value={this.state.passwordVal}
                onChangeText={(text) => this.changeVal2(text)}></TextInput>

              {this.props.loginError ? (
                <Text style={styles.loginError}>
                  {this.props.loginErrorMsg}
                </Text>
              ) : null}

              <View>
                {!this.props.loginEnabled ? (
                  <ActivityIndicator
                    color="white"
                    size="large"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 35,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 3,
                    }}
                  />
                ) : null}

                <TouchableOpacity
                  onPress={this.login}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: this.props.loginEnabled
                        ? '#3AB24A'
                        : 'gray',
                    },
                  ]}
                  disabled={!this.props.loginEnabled}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 25,
                      fontFamily: 'HelveticaNeue-Bold',
                      paddingTop: 5,
                    }}>
                    LOG IN
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={this.join}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: '#3AB24A',
                    },
                    {marginTop: 10},
                  ]}
                  disabled={!this.props.loginEnabled}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 25,
                      fontFamily: 'HelveticaNeue-Bold',
                      paddingTop: 5,
                    }}>
                    JOIN NOW
                  </Text>
                </TouchableOpacity> */}

                {this.props.accessFeature > 0 ? (
                  <TouchableOpacity
                    onPress={this.join}
                    style={[{marginTop: 20}]}>
                    <Text
                      style={{
                        color: '#3AB24A',
                        fontSize: 18,
                        fontFamily: 'HelveticaNeue',
                        textAlign: 'center',
                      }}>
                      Join now
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {/* <View style={{height: 270}}></View> */}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginEnabled: state.loginEnabled,
    loginError: state.loginError,
    loggedIn: state.loggedIn,
    accessFeature: state.accessFeature,
    loginErrorMsg: state.loginErrorMsg,
  };
};

export default connect(mapStateToProps, {
  loginUser,
  manageLogin,
  login,
})(SignIn);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
  submitBtn: {
    fontFamily:
      Platform.OS === 'ios'
        ? 'HelveticaNeue-Medium'
        : 'HelveticaNeue-Medium-11',
    fontSize: 25,
    color: 'white',
    textAlign: 'center',

    height: 65,
    alignItems: 'center',
    padding: 10,
  },
  loginError: {marginBottom: 20, color: 'red', fontSize: 22},
  txtHeader: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#3AB24A',
  },
  inputTxt: {
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
    color: '#5F5F5F',
    marginTop: 5,
    borderColor: '#707070',
    height: 55,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
