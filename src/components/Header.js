import React, {Component, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import activeImg from '../../images/active-listening.png';
import headerLogo from '../../images/header-logo.png';
import menuIcon from '../../images/menu-icon.png';
const Header = () => {
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
          top: 35,
        }}>
        <Image source={menuIcon} style={{zIndex: 3}} />
      </TouchableOpacity>
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
