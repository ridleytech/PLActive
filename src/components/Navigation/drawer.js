import React from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {Title, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import {AuthContext} from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bgImg from '../../../images/menu-bg.png';

function DrawerContent(props) {
  //const paperTheme = useTheme();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.loggedIn);
  const username = useSelector((state) => state.username);

  const removeUserInfo = () => {
    console.log('removeUserInfo drawer');

    deleteUser();
    deleteUsername();
    deletePassword();
    dispatch({type: 'RESET_PROGRESS'});
  };

  const deleteUsername = async () => {
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

  const deletePassword = async () => {
    try {
      await AsyncStorage.removeItem('password');

      console.log('password deleted');
    } catch (error) {
      // Error saving data
    }
  };

  const deleteUser = async () => {
    try {
      await AsyncStorage.removeItem('hasUser');

      console.log('user deleted');
    } catch (error) {
      // Error saving data
    }
  };

  //const {signOut, toggleTheme} = React.useContext(AuthContext);

  return (
    <ImageBackground source={bgImg} style={styles.image}>
      <View style={{flex: 1, padding: 0, margin: 0}}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 25,
            }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Title style={styles.title}>
                {authStatus ? `Hi, ${username}` : ''}
              </Title>
            </View>
          </View>
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="CHALLENGES"
            labelStyle={styles.item}
            onPress={() => {
              dispatch({type: 'SET_MODE', mode: 0});
              dispatch({type: 'SET_LEVEL', level: 0});
              props.navigation.navigate('CHALLENGES');
            }}
          />
        </Drawer.Section>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="SUPPORT"
            labelStyle={styles.item}
            onPress={() => {
              props.navigation.navigate('SUPPORT');
            }}
          />
        </Drawer.Section>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="LEADER BOARD"
            labelStyle={styles.item}
            onPress={() => {
              props.navigation.navigate('LEADER BOARD');
            }}
          />
        </Drawer.Section>

        {!authStatus ? (
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="LOG IN"
              labelStyle={styles.item}
              onPress={() => {
                dispatch({type: 'SHOW_LOGIN'});
                props.navigation.toggleDrawer();
                props.navigation.navigate('CHALLENGES');
              }}
            />
          </Drawer.Section>
        ) : (
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="LOG OUT"
              labelStyle={styles.item}
              onPress={() => {
                //props.navigation.navigate('LOG OUT');
                [dispatch({type: 'LOGOUT_USER'}), removeUserInfo()];
                props.navigation.toggleDrawer();
              }}
            />
          </Drawer.Section>
        )}
      </View>
    </ImageBackground>
  );
}

export default DrawerContent;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  itemSeperator: {borderColor: 'white', borderWidth: 1},
  drawerContent: {
    flex: 1,
    //backgroundColor: 'black',
  },
  icon: {width: 20, height: 20},
  icon2: {width: 25, height: 25},
  icon3: {width: 24, height: 24, marginLeft: 1},
  userInfoSection: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'HelveticaNeue',
    height: 25,
  },
  item: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue',
    marginTop: 3,
    fontWeight: 'bold',
    color: '#F6FA43',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  drawerSectionNone: {
    borderTopWidth: 1,
  },
});
