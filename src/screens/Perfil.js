import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import FBSDK, {
  LoginButton,
  AccessToken
} from 'react-native-fbsdk'
import { Actions } from 'react-native-router-flux';


export default class Perfil extends Component {
  constructor() {
    super();
  }  
  render() {
    return (
      <Text>Hola mundo!</Text>
    );
  }
}

const styles = StyleSheet.create({
  
});
