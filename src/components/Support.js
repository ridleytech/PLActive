import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ActivityIndicator,
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
    inputVal: '',
  };

  changeVal = (val) => {
    if (val) {
      this.setState({
        inputVal: val,
      });
    } else {
      this.setState({
        inputVal: '',
      });
    }
  };

  componentDidMount() {
    //console.log('support did mount');
  }

  componentDidMount() {
    console.log('support did unmount');
    this.props.clearSupportError();
  }

  // componentDidUpdate(prevProps, nextState) {
  //   if (this.state.inputVal != nextState.inputVal) {
  //     // if (this.state.inputVal.length > 0) {
  //     //   this.props.manageSupport(true);
  //     // } else {
  //     //   this.props.manageSupport(false);
  //     // }
  //   }
  // }

  sendMessage = () => {
    this.props.manageSupport(false);
    this.props.sendSupportMessage(this.state.inputVal);
  };

  render() {
    //console.log('Support 2 props: ' + JSON.stringify(this.props));

    return (
      //console.log('user: ' + props.user);
      <>
        <SafeAreaView />
        <Header props={this.props} />

        <View style={styles.content}>
          <Text style={styles.txtHeader}>Support</Text>
          <TextInput
            autoCapitalize="none"
            multiline={true}
            style={styles.inputTxt}
            onChangeText={(text) => this.changeVal(text)}></TextInput>

          {this.props.supportError ? (
            <Text style={styles.supportError}>
              Message was not sent. Please try again later.
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
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    supportEnabled: state.supportEnabled,
    supportError: state.supportError,
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
  supportError: {marginBottom: 20, color: 'red', fontSize: 22},
  txtHeader: {fontFamily: 'HelveticaNeue-Bold', fontSize: 20, marginBottom: 10},
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
});
