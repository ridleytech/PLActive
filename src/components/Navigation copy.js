import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, StyleSheet} from 'react-native';
import Home from './Home';
//import API from './debug/API';
import Loading from './Loading';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
//import {authUser} from '../actions';
//import menuIcon from '../images/menu-icon.png';

const menuBtn = (props) => {
  return (
    <View style={{marginLeft: 20, marginBottom: -13}}>
      <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
        {/* <Image source={menuIcon} style={{width: 25, height: 25}} /> */}
      </TouchableOpacity>
    </View>
  );
};

//side nav

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator
    drawerPosition="left"
    drawerType="back"
    drawerContentOptions={{
      activeTintColor: 'rgb(255,114,0)',
    }}>
    <AppDrawer.Screen name="Home" component={Home} />
  </AppDrawer.Navigator>
);

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
    // if (this.state.isLoading) {
    //   return <Loading />;
    // }

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
    <RootStack.Screen name="App" component={AppDrawerScreen} />
  </RootStack.Navigator>
);

const mapStateToProps = (state) => {
  return {
    user: state.user,
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
