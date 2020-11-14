import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {manageLogin, login} from '../../actions';
import {loginUser} from '../../thunks';
import headerLogo from '../../../images/header-logo.png';

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

  componentDidMount() {
    //this.props.manageLogin(false);
    //debug
    //this.props.manageLogin(true);
    this.setState({
      usernameVal: 'ridley1224',
    });
    this.setState({
      passwordVal: 'check1224',
    });
    //this.retrieveData();

    // sendEmail(
    //   'registerrt1224@gmail.com',
    //   'Piano Lessons with Warren Support!',
    //   'Test message.',
    // ).then(() => {
    //   console.log('Our email successful provided to device mail ');
    // });
    // const to = ['registerrt1224@gmail.com']; // string or array of email addresses
    // email(to, {
    //   // Optional additional arguments
    //   //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
    //   //bcc: 'mee@mee.com', // string or array of email addresses
    //   subject: 'Show how to use',
    //   body: 'Some body right here',
    // }).catch(console.error);
  }

  componentDidUpdate(prevProps, nextState) {
    // if (this.state.usernameVal != nextState.usernameVal) {
    //   //console.log('quickValChanged');
    //   // console.log('update');
    //   // if (this.state.usernameVal.length > 0) {
    //   //   this.props.manageLogin(true);
    //   // } else {
    //   //   this.props.manageLogin(false);
    //   // }
    // }

    if (prevProps.loggedIn != this.props.loggedIn) {
      console.log('loggedin changed: ' + this.props.loggedIn);

      this.storeUsername(this.state.usernameVal);
      this.storePassword(this.state.passwordVal);
      this.storeUser();
    }

    // if (
    //   this.state.hasUser &&
    //   this.state.usernameVal &&
    //   this.state.passwordVal
    // ) {
    //   console.log('has all vals');

    //   //this.props.login(true);
    // }
  }

  login = () => {
    //console.log('login');
    this.props.manageLogin(false);
    this.props.loginUser(this.state.usernameVal, this.state.passwordVal);
  };

  retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('username');

      if (value !== null) {
        // We have data!!
        console.log(`username: ${value}`);

        this.setState({
          usernameVal: value,
        });
      } else {
        console.log('no username');

        this.setState({
          usernameVal: null,
        });
      }
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem('password');

      if (value2 !== null) {
        // We have data!!
        console.log(`password: ${value2}`);

        this.setState({
          passwordVal: value2,
        });
      } else {
        console.log('no password');

        this.setState({
          passwordVal: null,
        });
      }
    } catch (error) {
      // Error retrieving data
    }

    try {
      var value2 = await AsyncStorage.getItem('hasUser');

      if (value2 !== null) {
        // We have data!!
        console.log(`user: ${value2}`);

        this.setState({
          hasUser: value2,
        });
      } else {
        console.log('no user');

        this.setState({
          hasUser: null,
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  storeUsername = async () => {
    try {
      await AsyncStorage.setItem('username', this.state.usernameVal);

      console.log('username saved: ' + this.state.usernameVal);
    } catch (error) {
      // Error saving data
    }
  };

  storePassword = async () => {
    try {
      await AsyncStorage.setItem('password', this.state.passwordVal);

      console.log('password saved: ' + this.state.passwordVal);
    } catch (error) {
      // Error saving data
    }
  };

  storeUser = async () => {
    try {
      await AsyncStorage.setItem('hasUser', 'true');

      console.log('user saved');
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    //console.log('SignIn 2 props: ' + JSON.stringify(this.props));

    return (
      //console.log('user: ' + props.user);
      <>
        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Image
            source={headerLogo}
            style={{
              zIndex: 5,
              width: 94,
              height: 55,
            }}
          />
        </View> */}

        <View style={styles.content}>
          <Text style={styles.txtHeader}>Username</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.inputTxt}
            value={this.state.usernameVal}
            onChangeText={(text) => this.changeVal(text)}></TextInput>
          <Text style={styles.txtHeader}>Password</Text>
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.inputTxt}
            value={this.state.passwordVal}
            onChangeText={(text) => this.changeVal2(text)}></TextInput>

          {this.props.loginError ? (
            <Text style={styles.loginError}>
              Username/password combination invalid.
            </Text>
          ) : null}

          <View>
            {/* {this.state.hasUser ? <Text>has user</Text> : null} */}

            {!this.props.loginEnabled ? (
              <ActivityIndicator
                color="white"
                size="large"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
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
    loggedIn: state.loggedIn,
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
