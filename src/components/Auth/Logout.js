import React, {Component} from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {logout, manageLogin, clearSupportError} from '../../actions';
import {TouchableOpacity} from 'react-native-gesture-handler';

class Logout extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.logout();
  }

  logout = () => {
    console.log('logout');

    //this.props.manageLogin(false);
    this.props.logout();
    this.props.clearSupportError();

    this.deleteUsername();
    this.deletePassword();
    this.deleteUser();
    this.deleteInterval();
    this.deletePitch();
    this.deleteBass();
    this.deleteProgression();
    this.deleteTriads();
  };

  deleteUsername = async () => {
    try {
      await AsyncStorage.removeItem('username');

      console.log('username deleted');
    } catch (error) {
      // Error saving data
    }

    try {
      await AsyncStorage.removeItem('user');

      console.log('user deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deletePassword = async () => {
    try {
      await AsyncStorage.removeItem('password');

      console.log('password deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deleteUser = async () => {
    try {
      await AsyncStorage.removeItem('hasUser');

      console.log('user deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deleteInterval = async () => {
    try {
      await AsyncStorage.removeItem('highestCompletedIntervalBrokenLevel');

      console.log('highestCompletedIntervalBrokenLevel deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deletePitch = async () => {
    try {
      await AsyncStorage.removeItem('highestCompletedPitchLevel');

      console.log('highestCompletedPitchLevel deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deleteTriads = async () => {
    try {
      await AsyncStorage.removeItem('highestCompletedTriadsLevelBroken');

      console.log('highestCompletedTriadsLevelBroken deleted');
    } catch (error) {
      // Error saving data
    }

    try {
      await AsyncStorage.removeItem('highestCompletedTriadsLevelBlocked');

      console.log('highestCompletedTriadsLevelBlocked deleted');
    } catch (error) {
      // Error saving data
    }
  };

  deleteBass = async () => {
    try {
      await AsyncStorage.removeItem('highestCompletedBassLevel');

      console.log('highestCompletedBassLevel deleted logout');
    } catch (error) {
      // Error saving data
    }
  };

  deleteProgression = async () => {
    try {
      await AsyncStorage.removeItem('highestCompleteProgressionLevel');

      console.log('highestCompleteProgressionLevel deleted logout');
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={() => this.logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  logout,
  manageLogin,
  clearSupportError,
})(Logout);
