/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { NavigationComponent } from 'react-native-material-bottom-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import { TabNavigator } from 'react-navigation'
import HomeTab from './Tabs/HomeTab'
import FriendsTab from './Tabs/FriendsTab'
import MisRetosTab from './Tabs/MisRetosTab'
import NewTab from './Tabs/NewTab'
import PerfilTab from './Tabs/PerfilTab'
const Pestanas = TabNavigator({
  Home: { screen: HomeTab },
  New: { screen: NewTab },
  MisRetos: { screen: MisRetosTab },
  Perfil: { screen: PerfilTab }
}, {
    tabBarComponent: NavigationComponent,
    tabBarPosition: 'bottom',

    tabBarOptions: {
      bottomNavigationOptions: {
        labelColor: 'white',
        rippleColor: 'white',
        shifting: false,
        tabs: {
          Home: {
            barBackgroundColor: '#535B9F',// like in the standalone version, this will override the already specified `labelColor` for this tab
            activeLabelColor: 'white',
            activeIcon: <Icon size={24} color="#FF80AB" name="md-home" />
          },
          New: {
            barBackgroundColor: '#535B9F', // like in the standalone version, this will override the already specified `labelColor` for this tab
            activeLabelColor: 'white',
            activeIcon: <Icon size={24} color="#FF80AB" name="md-add-circle" />
          },
          MisRetos: {
            barBackgroundColor: '#535B9F', // like in the standalone version, this will override the already specified `labelColor` for this tab
            activeLabelColor: 'white',
            activeIcon: <Icon size={24} color="#FF80AB" name="md-flash" />
          },
          Perfil: {
            barBackgroundColor: '#535B9F',// like in the standalone version, this will override the already specified `labelColor` for this tab
            activeLabelColor: 'white',
            activeIcon: <Icon size={24} color="#FF80AB" name="md-contact" />
          },
        }
      }
    }
  })


export default class HomeView extends Component {

  render() {
    return (
      <Pestanas />
    );
  }
}



