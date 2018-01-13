import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Picker,
  TextInput,
  ScrollView,
  Button, DatePickerAndroid,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableNativeFeedback,
  Image,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Toolbar from 'react-native-toolbar';
import store from '../store'
import Ripple from 'react-native-material-ripple';
import { firebaseDatabase, firebaseAuth } from '../firebase'
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0043;
const LONGITUDE_DELTA = 0.0034;
const SPACE = 0.01;
export default class NewTab extends React.Component {
  constructor() {
    super()
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    this.state = {
      idUser: uid,
      nombre_reto: null,
      creador: displayName,
      photoCreador: photoURL,
      categoria: 'Futbol',
      fechaReto: 'Toque para establecer fecha',
      horaReto: 'y la hora',
      numero_paricipantes: null,
      latitude: 0,
      longitude: 0,
      isLoading: false,
      referenciaLugar:"",
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markerPosition: null,
    }
  }


  

  AbrirPickerDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        const mes = month < 9 ? '0' + (month + 1) : (month + 1)
        const dia = day < 10 ? '0' + day : day
        const fechaActual = new Date()
        const yearCurrent = fechaActual.getFullYear()
        const monthCurrent = fechaActual.getMonth() >= 9 ? fechaActual.getMonth() + 1 : "0" + (fechaActual.getMonth() + 1)
        const dayCurrent = fechaActual.getDate() >= 10 ? fechaActual.getDate() : "0" + (fechaActual.getDate())


        this.setState({
          fechaReto: dia + '-' + mes + '-' + year,
          fecha_sistema: parseInt(year.toString() + mes.toString() + dia.toString()),
          fecha_creacion: dayCurrent + '-' + monthCurrent + '-' + yearCurrent,
        })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  onPressGuardarReto = () => {
    if (this.EsValido()) {
      const reto = this.state
      const idUser = reto.idUser
      this.setState({ isLoading: true })
      const retosRef = this.getRetosRef()
      const newRetoRef = retosRef.push();
      var participantes_ = {}
      participantes_[idUser] = {
        nombre: reto.creador,
        photo: reto.photoCreador,
      }
      newRetoRef.set({
        nombre_reto: reto.nombre_reto,
        creador: reto.creador,
        id_creador: reto.idUser,
        photoCreador: reto.photoCreador,
        categoria: reto.categoria,
        fechaReto: reto.fechaReto,
        horaReto: reto.horaReto,
        fecha_sistema: reto.fecha_sistema,//esta fecha es por la cual se ordenara
        fecha_sistema_eva: reto.fecha_sistema_eva,//esta fecha es por la cual se ordenara
        fecha_creacion: reto.fecha_creacion,//la fecha que se creo el reto
        numero_paricipantes: (parseInt(reto.numero_paricipantes) - 1),
        latitude: reto.latitude,
        longitude: reto.longitude,
        participantes: participantes_,
        referenciaLugar:reto.referenciaLugar,

      }).then(() => {
        const retosParticipantesRef = this.getRetosParticipantesRef(newRetoRef.key)
        const newRetosParticipantesRef = retosParticipantesRef.push()
        newRetosParticipantesRef.set({
          id_user: idUser,
          nombre: reto.creador,
          photo: reto.photoCreador,
        }).then(() => {
          store.dispatch({
            type: 'FINISH_STATE',
            location: null,
          })
          this.CargarNuevo()
        })

      })
    } else {
      Alert.alert("Tenga en cuenta :", "* Seleccionar lugar \n* Ingresar nombre del reto \n* Ingresar fecha del reto\n* Numero de participantes mayor a 1")
    }

  }
  EsValido = () => {

    if (!this.state.nombre_reto || this.state.nombre_reto === ""
      || this.state.fechaReto === "Toque para establecer Fecha..."
      || (parseInt(this.state.numero_paricipantes) < 2)
      || isNaN(parseInt(this.state.numero_paricipantes))
      || !this.state.markerPosition)
      return false
    return true
  }
  CargarNuevo = () => {
    this.setState({
      nombre_reto: null,
      categoria: 'Futbol',
      fechaReto: 'Toque para establecer fecha',
      horaReto: 'y hora',
      numero_paricipantes: null,
      latitude: 0,
      longitude: 0,
      isLoading: false,
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markerPosition: null,
      isDateTimePickerVisible: false,
      referenciaLugar:"",
    })
    this.BuscarPosicion()
  }
  getRetosRef = () => {
    return firebaseDatabase.ref('retos/')
  }
  getRetosUsuarioRef = (idReto) => {
    return firebaseDatabase.ref('retosUsuario/' + this.state.idUser + '/' + idReto)
  }
  getRetosParticipantesRef = (idReto) => {
    return firebaseDatabase.ref('retoParticipantes/' + idReto + '/')
  }
  componentDidMount() {
    store.subscribe(() => {
      if (store.getState().location != null) {
        var initialRegion = {
          latitude: store.getState().location.latitude,
          longitude: store.getState().location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        if (this.refs.myRef)
          this.setState({
            markerPosition: store.getState().location,
            initialPosition: initialRegion,
            latitude: store.getState().location.latitude,
            longitude: store.getState().location.longitude,
          })
      }

    })
    if (!this.state.markerPosition) {
      this.BuscarPosicion()
    }

  }
  BuscarPosicion = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({ initialPosition: initialRegion });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)
      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({ initialPosition: initialRegion });
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  AbrirMapa = () => {
    Actions.mapa({ initialPosition: this.state.initialPosition })
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    //Fecha Seleccionada
    const year = date.getFullYear()
    const mes = date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
    const dia = date.getDate() >= 10 ? date.getDate() : "0" + (date.getDate())
    const hora = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    const minutos = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    //Fecha Actual
    const fechaActual = new Date()
    const yearCurrent = fechaActual.getFullYear()
    const monthCurrent = fechaActual.getMonth() >= 9 ? fechaActual.getMonth() + 1 : "0" + (fechaActual.getMonth() + 1)
    const dayCurrent = fechaActual.getDate() >= 10 ? fechaActual.getDate() : "0" + (fechaActual.getDate())
    const fechaReto = new Date(year + '/' + mes + '/' + dia)
    if (fechaReto - fechaActual >= 0)
      this.setState({
        fechaReto: dia + '-' + mes + '-' + year,
        horaReto: hora + ':' + minutos + ':00',
        fecha_sistema: parseInt(year.toString() + mes.toString() + dia.toString()),
        fecha_sistema_eva: year + '/' + mes + '/' + dia,
        fecha_creacion: dayCurrent + '-' + monthCurrent + '-' + yearCurrent,
      })
    else
      Alert.alert("Espere", "La Fecha debe ser posterior a la actual")
    console.log('A date has been picked: ', date);
    this._hideDateTimePicker();
  };
  render() {
    return (
      <View style={styles.container} ref="myRef">
        <View style={styles.toolbar}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.titleToolbar}>Crear nuevo challenge</Text>
            <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
          </View>
        </View>
        <ScrollView style={styles.containerNuevo}>
          <Text style={styles.tituloLabel}>Categoria :</Text>
          <View style={styles.pickerCategoria}>

            <Picker
              selectedValue={this.state.categoria}
              onValueChange={(itemValue, itemIndex) => this.setState({ categoria: itemValue })}>
              <Picker.Item label="Futbol" value="Futbol" />
              <Picker.Item label="Voley" value="Voley" />
              <Picker.Item label="Basket" value="Basket" />
              <Picker.Item label="Tenis" value="Tenis" />
            </Picker>
          </View>
          <Text style={styles.tituloLabel}>Seleccionar Lugar :</Text>
          <MapView
            showsUserLocation={true}
            zoomEnabled={true}
            showsMyLocationButton={true}
            ref={ref => { this.map = ref; }}
            style={styles.map}
            region={this.state.initialPosition}
            onPress={() => this.AbrirMapa()}>
            {this.state.markerPosition && <MapView.Marker
              coordinate={this.state.markerPosition}
            />}
          </MapView>
          <TextInput
            value={this.state.referenciaLugar}
            onChangeText={(text) => this.setState({ referenciaLugar: text })}
            placeholder={"Escriba alguna referencia"} />

          <Text style={styles.tituloLabel}>Nombre del Reto :</Text>
          <TextInput
            value={this.state.nombre_reto}
            onChangeText={(text) => this.setState({ nombre_reto: text })}
            placeholder={"Escriba el nombre del Evento"} />
          <Text style={styles.tituloLabel}>Fecha del Reto :</Text>
          <TouchableOpacity style={styles.fechaChooser} onPress={() => this._showDateTimePicker()}>
            <Icon size={35} color="#7f8c8d" name="md-calendar" />
            <Text style={{ width: screenWidth - 190, marginLeft: 10, }} >{this.state.fechaReto}</Text>
            <Icon size={30} color="#7f8c8d" name="ios-clock-outline" />
            <Text style={{ marginLeft: 5, }} >{this.state.horaReto}</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode={'datetime'}
            is24Hour={false}
          />
          <Text style={styles.tituloLabel}>Cantidad de Participantes :</Text>
          <TextInput
            value={this.state.numero_paricipantes}
            onChangeText={(text) => this.setState({ numero_paricipantes: text })}
            keyboardType={'numeric'} placeholder={"Numero de participantes"} />

          <TouchableOpacity onPress={() => this.onPressGuardarReto()}
            style={{ justifyContent: 'center', marginTop: 10, marginBottom: 20, alignItems: 'center' }}>
            <Icon size={50} color="#16a085" name="ios-checkmark-circle" />
            <Text style={{ color: '#16a085' }}>Toque para crear</Text>
          </TouchableOpacity>


        </ScrollView>
        {this.state.isLoading &&
          <View style={[styles.containerLoading, styles.overlay]}>
            <View style={{
              height: 100, width: 100,
              justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'white', borderRadius: 10,
            }}>

              <ActivityIndicator size={'large'} />
              <Text style={{ fontWeight: 'bold', marginTop: 10, }}>Creando...</Text>
            </View>

          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  map: {
    height: 120,

  },
  containerLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  containerNuevo: {
    padding: 10,
    backgroundColor: '#FFF',
    margin: 5,
  },
  containerButton: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    minHeight: 56,
    margin: 4,
    borderRadius: 2,
    elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  a: {
    backgroundColor: '#EC268F',
  },
  textButton: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,.87)',
    textAlign: 'center',

  },

  titleApp: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    opacity: 0.8,
    textShadowColor: '#EC268F'
  },
  pickerCategoria: {
    borderWidth: 1,
    borderColor: '#7f8c8d',
    borderRadius: 5,
    
  },
  botonGuardar: {
    marginTop: 30,

  },
  tituloLabel: { fontWeight: 'bold', paddingBottom: 0, paddingTop: 5, },
  fechaChooser: {
    flexDirection: 'row',
    alignItems: 'center'
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
});