import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Header from './Header';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {manageSupport, clearSupportError} from '../actions';
import {sendSupportMessage} from '../thunks';

class Support extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  state = {
    message: '',
  };

  changeVal = (val) => {
    if (val) {
      this.setState({
        message: val,
      });
    } else {
      this.setState({
        message: '',
      });
    }
  };

  changeVal1 = (val) => {
    if (val) {
      this.setState({
        email: val,
      });
    } else {
      this.setState({
        email: '',
      });
    }
  };

  changeVal2 = (val) => {
    if (val) {
      this.setState({
        subject: val,
      });
    } else {
      this.setState({
        subject: '',
      });
    }
  };

  changeVal4 = (val) => {
    if (val) {
      this.setState({
        name: val,
      });
    } else {
      this.setState({
        name: '',
      });
    }
  };

  componentDidMount() {
    //console.log('support did mount');
  }

  componentDidMount() {
    //console.log('support did unmount');
    this.props.clearSupportError();

    // this.setState({
    //   name: 'Randall Ridley',
    //   subject: 'Test Support from App 2',
    //   email: 'registerrt1224@gmail.com@gmail.com',
    //   message: 'Final test message',
    // });
  }

  componentDidUpdate(prevProps, nextState) {
    // if (this.state.message != nextState.message) {
    //   // if (this.state.message.length > 0) {
    //   //   this.props.manageSupport(true);
    //   // } else {
    //   //   this.props.manageSupport(false);
    //   // }
    // }

    if (
      prevProps.supportSent != this.props.supportSent &&
      this.props.supportSent == true
    ) {
      this.setState({
        name: '',
        subject: '',
        email: '',
        message: '',
      });
    }
  }

  sendMessage = () => {
    if (!this.state.name) {
      Alert.alert(
        null,
        `Please enter name.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    if (!this.state.email) {
      Alert.alert(
        null,
        `Please enter email.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    if (!this.state.subject) {
      Alert.alert(
        null,
        `Please enter subject.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    if (!this.state.message) {
      Alert.alert(
        null,
        `Please enter message.`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }

    this.props.manageSupport(false);
    this.props.sendSupportMessage(
      this.state.name,
      this.state.email,
      this.state.subject,
      this.state.message,
    );
  };

  render() {
    //console.log('Support 2 props: ' + JSON.stringify(this.props));

    return (
      //console.log('user: ' + props.user);
      <>
        <SafeAreaView />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Header props={this.props} />

          <View style={styles.content}>
            <ScrollView>
              <Text style={[styles.txtHeader, {marginTop: 20}]}>Support</Text>
              <Text style={{marginBottom: 40, fontSize: 16}}>
                HOW CAN WE HELP YOU?
              </Text>

              <Text style={styles.txtHeader}>Name</Text>

              <TextInput
                autoCompleteType="off"
                autoCapitalize="none"
                style={styles.inputTxt1}
                onChangeText={(text) => this.changeVal4(text)}
                value={this.state.name}></TextInput>
              <Text style={styles.txtHeader}>Email</Text>

              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                style={styles.inputTxt1}
                onChangeText={(text) => this.changeVal1(text)}
                value={this.state.email}></TextInput>
              <Text style={styles.txtHeader}>Subject</Text>

              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                style={styles.inputTxt1}
                onChangeText={(text) => this.changeVal2(text)}
                value={this.state.subject}></TextInput>
              <Text style={styles.txtHeader}>Message</Text>

              <TextInput
                autoCapitalize="none"
                autoCompleteType="off"
                multiline={true}
                style={styles.inputTxt}
                onChangeText={(text) => this.changeVal(text)}
                value={this.state.message}></TextInput>

              {this.props.supportSent ? (
                <Text style={styles.supportSuccess}>
                  {this.props.responseMessage}
                </Text>
              ) : this.props.supportError ? (
                <Text style={styles.supportError}>
                  {this.props.responseMessage}
                </Text>
              ) : null}

              <View>
                {!this.props.supportEnabled ? (
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
                  onPress={this.sendMessage}
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor: this.props.supportEnabled
                        ? '#3AB24A'
                        : 'gray',
                    },
                  ]}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 25,
                      fontFamily: 'HelveticaNeue-Bold',
                      paddingTop: 5,
                    }}>
                    SUBMIT
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{height: 270}} /> */}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    supportEnabled: state.supportEnabled,
    supportError: state.supportError,
    supportSent: state.supportSent,
    responseMessage: state.responseMessage,
  };
};

export default connect(mapStateToProps, {
  sendSupportMessage,
  manageSupport,
  clearSupportError,
})(Support);

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
  supportError: {marginBottom: 20, color: 'red', fontSize: 22},
  supportSuccess: {marginBottom: 20, color: 'green', fontSize: 22},

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
    height: 150,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 20,
    padding: 15,
  },
  inputTxt1: {
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
    padding: 15,
  },
});
