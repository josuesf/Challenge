/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import firebase, {
  firebaseAuth
} from "./firebase";

const { FacebookAuthProvider } = firebase.auth


export default class LoginView extends Component {
  constructor() {
    super();

    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      credencialsUser: null,
      estaLogueado: true,
      connection: true,
    }
  }


  componentWillMount() {
    //this.recuperarClaves()
    this.authenticateUser()
  }
  guardarClaves = async (credencial) => {
    try {
      await AsyncStorage.setItem('CREDENTIALS', JSON.stringify(credencial.credencialsUser));
<<<<<<< HEAD
      // {uid:31313142,displayName:nombre,email:dadada,photoUrl:http//dasdasada.png}
=======
>>>>>>> 83298d537dfb6be6eb10a66d29602a1cb4667885
    } catch (error) {
      // Error saving data
    }
  }
  recuperarClaves = async () => {
    try {
      const value = await AsyncStorage.getItem('CREDENTIALS');
      if (value !== null) {
        // We have data!!
        const credentials = (JSON.parse(value)).credentialsUser
        this.setState({
          credentialsUser: {
            uid: credentials.uid,
            displayName: credentials.displayName,
            email: credentials.email,
            photoURL: credentials.photoURL,
          }
        })
        Actions.replace('home')
      } else {
        this.setState({ estaLogueado: false })
        this.authenticateUser()
      }
    } catch (error) {
      // Error retrieving data

      console.log(error)
    }
  }
  authenticateUser = () => {
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        const { accessToken } = data
        const credential = FacebookAuthProvider.credential(accessToken)
        // Sign in user with another account
        firebaseAuth.signInWithCredential(credential).then((credentials) => {
          this.setState({
            credentialsUser: {
              uid: credentials.uid,
              displayName: credentials.displayName,
              email: credentials.email,
              photoURL: credentials.photoURL,
            }
          })
          this.guardarClaves(this.state)
          AsyncStorage.getItem("DatosPersonales")
            .then(req => JSON.parse(req))
            .then(json => {
              if (json == null)
                Actions.perfilEdicion()
              else
                Actions.home()
            })
        }, (error) => {
          this.setState({ connection: false, })
          console.log("Sign In Error", error);
        });
      } else {
        this.setState({ estaLogueado: false })
      }
    })
  }


  handleLoginFinish = (error, result) => {
    if (error) {
      console.error("login has error: " + result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then((data) => {
        this.authenticateUser(data.accessToken)
      })
    }
  }
  hanleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('CREDENTIALS');
    } catch (error) {
      // Error saving data
      alert('Intente de nuevo.')
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo}
            source={require('./imgs/logoPeque.png')} />
        </View>
        <Text style={styles.welcome}>Challenge</Text>

        {!this.state.estaLogueado && <LoginButton
          readPermissions={["public_profile", "email"]}
          onLoginFinished={this.handleLoginFinish}
          onLogoutFinished={() => this.hanleLogOut()} />}
        {!this.state.connection &&
          <TouchableOpacity onPress={() => this.authenticateUser()}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Conectarse a Internet para continuar</Text>
          </TouchableOpacity>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#EC268F'
  },
  logoContainer: {

  },
  logo: {
    width: 100,
    height: 100,
  }

});
