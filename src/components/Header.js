import React, {Component, useState, version} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
} from 'react-native';
import activeImg from '../../images/active-listening.png';
import headerLogo from '../../images/header-logo.png';
import menuIcon from '../../images/menu-icon.png';
import backIcon from '../../images/back-btn.png';
import {useSelector, useDispatch} from 'react-redux';

const Header = (props) => {
  //console.log('header props: ' + JSON.stringify(props));

  //console.log('currentVersion header: ' + currentVersion);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const level = useSelector((state) => state.level);
  const triadmode = useSelector((state) => state.triadmode);
  const intervalmode = useSelector((state) => state.intervalmode);

  const goHome = () => {
    dispatch({type: 'SET_MODE', mode: 0});
    dispatch({type: 'SET_LEVEL', level: 0});
  };

  var showMenu = false;

  if (mode == 0) {
    showMenu = true;
  }

  const manageButton = () => {
    //console.log('manageButton');

    if (mode == 0) {
      props.props.navigation.toggleDrawer();
    } else if (mode == 1 && level > 0) {
      dispatch({type: 'SET_MODE', mode: 1});
      dispatch({type: 'SET_LEVEL', level: 0});
    } else if (mode == 2 && intervalmode > 0) {
      dispatch({type: 'SET_INTERVAL_MODE', mode: 0});
      dispatch({type: 'SET_LEVEL', level: 0});
    } else if (mode == 3 && triadmode > 0) {
      dispatch({type: 'SET_TRIAD_MODE', mode: 0});
      dispatch({type: 'SET_LEVEL', level: 0});
    } else {
      dispatch({type: 'SET_MODE', mode: 0});
      dispatch({type: 'SET_LEVEL', level: 0});
      dispatch({type: 'SET_TRIAD_MODE', mode: 0});
      dispatch({type: 'SET_INTERVAL_MODE', mode: 0});
    }

    //props.props.navigation.toggleDrawer();
  };

  return (
    <View style={{height: 100}}>
      <ImageBackground style={{flex: 1, zIndex: -1}} source={activeImg} />
      <View style={styles.overlay} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={headerLogo}
          style={{
            zIndex: 5,
            width: 94,
            height: 55,
          }}
        />
      </View>

      <TouchableOpacity
        style={{
          zIndex: 3,
          width: 35,
          height: 35,
          position: 'absolute',
          left: 20,
          top: 30,
        }}
        onPress={() => manageButton()}
        //onPress={() => goHome()}
      >
        <Image source={showMenu ? menuIcon : backIcon} style={{zIndex: 3}} />
      </TouchableOpacity>
      <Text
        style={{
          zIndex: 3,
          //width: 35,
          height: 35,
          position: 'absolute',
          right: 5,
          top: 5,
          fontSize: 10,
          color: 'white',
          fontWeight: 'bold',
        }}>
        Version {props.props.currentVersion}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
