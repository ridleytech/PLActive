import React, {Component} from 'react';
import {View, Text} from 'react-native';
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
