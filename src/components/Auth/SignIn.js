import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, Alert, Platform} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {manageLogin} from '../../actions';
import {loginUser} from '../../thunks';
import headerLogo from '../../../images/header-logo.png';

class SignIn extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  state = {
    myInformation: {},
    quickAddVal: '',
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
        quickAddVal: val,
      });
    } else {
      this.setState({
        quickAddVal: '',
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

  componentDidMount() {
    this.props.manageLogin(false);
  }

  componentDidUpdate(prevProps, nextState) {
    if (this.state.quickAddVal != nextState.quickAddVal) {
      //console.log('quickValChanged');

      console.log('update');

      if (this.state.quickAddVal.length > 0) {
        this.props.manageLogin(true);
      } else {
        this.props.manageLogin(false);
      }
    }
  }

  login = () => {
    //console.log('login');
    this.props.manageLogin(false);
    this.props.loginUser(this.state.quickAddVal, this.state.passwordVal);
  };

  render() {
    //console.log('SignIn 2 props: ' + JSON.stringify(this.props));

    return (
      //console.log('user: ' + props.user);
      <>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <Image
            source={headerLogo}
            style={{
              zIndex: 5,
              width: 94,
              height: 55,
            }}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.txtHeader}>Username</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.inputTxt}
            onChangeText={(text) => this.changeVal(text)}></TextInput>
          <Text style={styles.txtHeader}>Password</Text>
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.inputTxt}
            onChangeText={(text) => this.changeVal2(text)}></TextInput>

          {this.props.loginError ? (
            <Text style={styles.loginError}>
              Username/password combination invalid.
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={this.login}
            style={[
              styles.submitBtn,
              {backgroundColor: this.props.loginEnabled ? '#3AB24A' : 'gray'},
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
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginEnabled: state.loginEnabled,
    loginError: state.loginError,
  };
};

export default connect(mapStateToProps, {
  loginUser,
  manageLogin,
})(SignIn);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    marginTop: 50,
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
  txtHeader: {fontFamily: 'HelveticaNeue-Bold', fontSize: 20, marginBottom: 10},
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
