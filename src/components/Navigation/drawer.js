import React from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
//import Icon2 from '../../images/edit-icon.png';
// import Avatar1 from '../../images/a.png';
// import DB from '../../images/db.png';
// import Phase from '../../images/phase2.png';
// import Max from '../../images/max.png';
// import Profile from '../../images/profile.png';
// import Logout from '../../images/logout.png';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import {AuthContext} from '../components/context';

import bgImg from '../../../images/menu-bg.png';

function DrawerContent(props) {
  //const paperTheme = useTheme();
  const dispatch = useDispatch();

  //const {signOut, toggleTheme} = React.useContext(AuthContext);

  return (
    <ImageBackground source={bgImg} style={styles.image}>
      <View style={{flex: 1, padding: 0, margin: 0}}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
            }}>
            {/* <Avatar.Image source={Avatar1} size={50} /> */}
            <View
              style={{
                //marginLeft: 15,
                flexDirection: 'column',
              }}>
              <Title style={styles.title}>RANDALL RIDLEY</Title>
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
      </View>

      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem
          label="LOG OUT"
          labelStyle={styles.item}
          onPress={() => {
            props.navigation.navigate('LOG OUT');
          }}
        />
      </Drawer.Section>
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
});
