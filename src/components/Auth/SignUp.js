import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {authUser} from '../../actions';

class SignIn extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  authUser1 = () => {
    console.log('authUser');
    this.props.authUser({username: 'ridley1224', password: '1224'});
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button onPress={() => navigation.goBack()} title="Sign Up" />
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
  authUser,
})(SignIn);
