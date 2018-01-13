/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Platform,
  AsyncStorage, BackHandler,
  View,
} from 'react-native';

import { Actions, Scene, Router } from 'react-native-router-flux';
import LoginView from './LoginView'
import HomeView from './HomeView'
import Mapa from './screens/Mapa'
import mapaDetalle from './screens/mapaDetalle'
import DetalleReto from './screens/DetalleReto'
import HomeTab from './Tabs/HomeTab'
import NewTab from './Tabs/NewTab'
import MisRetosTab from './Tabs/MisRetosTab'
import PerfilTab from './Tabs/PerfilTab'
import FriendsTab from './Tabs/FriendsTab'
import Comentarios from './screens/Comentarios'
import SeleccionDeportes from './screens/SeleccionDeportes'
import PerfilEdicion from './screens/PerfilEdicion'
import LoginCorreo from './screens/LoginCorreo'
import Icon from 'react-native-vector-icons/Ionicons'
class RetosI extends React.Component {
  constructor() {
    super()

  }
  onBackPress = () => {
    console.log()
    if (Actions.state.index === 0) {
      return false
    }
    Actions.pop()
    return true
  }
  render() {
    const isAndroid = Platform.OS === 'android'
    const TabIcon = ({ focused, title, iconName }) => {
      const color_ = focused == true ? '#FF80AB' : '#FFF'
      return (
        <View>
          <Icon name={iconName} color={color_} size={25} />
        </View>
      )
    }
    return (
      <Router backAndroidHandler={this.onBackPress}>
        
        <Scene key="root">
          <Scene key="login" component={LoginView} initial hideNavBar />
          <Scene key="LoginCorreo" component={LoginCorreo}  hideNavBar />
          <Scene key="perfilEdicion" component={PerfilEdicion}  hideNavBar />
          <Scene key="seleccionDeportes" component={SeleccionDeportes} hideNavBar />
          <Scene key="home">
            <Scene key="homeTabs"
              tabs
              showIcon={true}
              tabbar
              swipeEnabled
              indicatorStyle={{ backgroundColor: "transparent" }}
              tabBarPosition={'bottom'}
              showLabel={false}
              tabBarStyle={{ backgroundColor: "#535B9F" }}
            >
              <Scene key="homeTab" title="Home" iconName="md-home" icon={TabIcon}>
                <Scene key="homeTab_" hideNavBar component={HomeTab} />
              </Scene>
              <Scene key="newTab" title="Nuevo" iconName="md-add-circle" icon={TabIcon}>
                <Scene key="newTab_" hideNavBar component={NewTab} />
              </Scene>
              <Scene key="MisRetosTab" title="Mis Retos" iconName="md-flash" icon={TabIcon}>
                <Scene key="MisRetosTab_" hideNavBar component={MisRetosTab} />
              </Scene>
              <Scene key="Amigos" title="Amigos" iconName="ios-people" icon={TabIcon}>
                <Scene key="amigos_" hideNavBar component={FriendsTab} />
              </Scene>
              <Scene key="PerfilTab" title="Perfil" iconName="md-contact" icon={TabIcon}>
                <Scene key="PerfilTab_" hideNavBar component={PerfilTab} />
              </Scene>
              
            </Scene>

          </Scene>

          <Scene key="detalleReto" title={"Detalle"} component={DetalleReto} hideNavBar={false} />
          <Scene key="comentarios" title={"Comentario"} component={Comentarios} hideNavBar={false} />
          <Scene key="mapa" component={Mapa} hideNavBar />
          <Scene key="mapaDetalle" component={mapaDetalle} hideNavBar />



        </Scene>
      </Router>
    );
  }
}



AppRegistry.registerComponent('RetosI', () => RetosI);
