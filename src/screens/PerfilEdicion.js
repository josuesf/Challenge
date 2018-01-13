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
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase, {
  firebaseAuth
} from "../firebase";

const widthScreen = Dimensions.get('window').width
const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE = 120
export default class PerfilEdicion extends Component {
  constructor() {
    super();

    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    this.state = {
      photo: photoURL,
      nombre_usuario: displayName,
      email: "",
      telefono: "",
      estaEnEdicion: false,
    }
  }


  componentWillMount() {
    AsyncStorage.getItem("DatosPersonales")
      .then(req => JSON.parse(req))
      .then(json => {
        if (json != null) {
          this.setState({
            photo: json.photo,
            nombre_usuario: json.nombre_usuario,
            email: json.email,
            telefono: json.telefono,
            estaEnEdicion: true,
          })
        }
      })
  }
  onPressGuardarPerfil = () => {
    if (this.state.nombre_usuario != '') {
      AsyncStorage.setItem("DatosPersonales", JSON.stringify(this.state))
        .then((res) => {
          if (this.state.estaEnEdicion)
            Actions.pop()
          else
            Actions.replace("seleccionDeportes")
        })
        .catch((err) => {
          alert(err)
        })
    } else {
      alert("Ingrese un nombre")
    }
  }

  render() {
    const { nombre_usuario, photo, email, telefono } = this.state
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.toolbar}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.titleToolbar}>Edicion de Perfil</Text>
              <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
            </View>
          </View>
          <View style={{ marginTop: 20, }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              {
                photo ?
                  <Image style={styles.avatar} source={{ uri: photo }} /> :
                  <Image style={styles.avatar} source={{ uri: DEFAULT_AVATAR }} />
              }

            </TouchableOpacity>
          </View>
          <TextInput value={nombre_usuario} placeholder={"Ingrese Nombre o Usuario"}
            onChangeText={(text) => this.setState({ nombre_usuario: text })} />
          <TextInput value={email} placeholder={"Escriba Email"}
            onChangeText={(text) => this.setState({ email: text })} />
          <TextInput value={telefono} placeholder={"Escriba telefono (opcional)"}
            onChangeText={(text) => this.setState({ telefono: text })} />
          <View style={{ marginTop: 40 }}>
            <Button onPress={() => this.onPressGuardarPerfil()} color={"#535B9F"} title="Guardar Datos"></Button>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  toolbar: {
    backgroundColor: '#FFF',
    height: 55,
    elevation: 10,
    justifyContent: 'center'

  },
  titleToolbar: {
    fontWeight: 'bold',
    color: '#535B9F',
  },
  image: {
    width: 40,
    height: 40,

  },
  avatar: {
    marginLeft: 15,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  nombre: {
    fontSize: 18,
    marginTop: 10,
    color: '#FF80AB'
  }
});
