import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, StyleSheet} from 'react-native';
import Home from './Home';
//import API from './debug/API';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Loading from './Loading';
import Logout from './Auth/Logout';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {authUser} from '../actions';
import menuIcon from '../../images/menu-icon.png';

const menuBtn = (props) => {
  return (
    <View style={{marginLeft: 20, marginBottom: -13}}>
      <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
        <Image source={menuIcon} style={{width: 25, height: 25}} />
      </TouchableOpacity>
    </View>
  );
};

//Games screens

const GamesStack = createStackNavigator();
const GameStackScreen = (props) => (
  <GamesStack.Navigator headerMode="none">
    <GamesStack.Screen name="Quizzes" component={Home} />
  </GamesStack.Navigator>
);

//side nav

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator
    drawerPosition="left"
    drawerType="back"
    drawerContentOptions={{
      activeTintColor: '#3AB24A',
    }}>
    <AppDrawer.Screen
      name="Tabs"
      component={GameStackScreen}
      options={{drawerLabel: 'Home'}}
    />
    <AppDrawer.Screen name="Log Out" component={Logout} />
  </AppDrawer.Navigator>
);

//authentication screens

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => {
  return (
    <AuthStack.Navigator initialRouteName={SignIn} headerMode="none">
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

class Navigation extends Component {
  constructor(props: Props) {
    super(props);
  }

  state = {
    isLoading: true,
  };

  componentDidMount() {
    //throw new Error('My first Sentry error!');

    setTimeout(() => {
      this.setState({
        isLoading: !this.state.isLoading,
        //user: {username: 'ridley1224'},
      });
    }, 500);

    //this.props.authUser({username: 'ridley1224', password: '1224'});
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <NavigationContainer>
        <RootStackScreen props={this.props} />
      </NavigationContainer>
    );
  }
}

const RootStack = createStackNavigator();
const RootStackScreen = ({userToken, props}) => (
  <RootStack.Navigator headerMode="none">
    {props.loggedIn ? (
      <RootStack.Screen name="App" component={AppDrawerScreen} />
    ) : (
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
    )}
  </RootStack.Navigator>
);

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loggedIn: state.loggedIn,
  };
};

const styles = StyleSheet.create({
  tabBar: {
    fontSize: 12,
  },
  headerImg: {
    width: 20,
    height: 20,
  },
});

export default connect(mapStateToProps, {authUser})(Navigation);
