import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons'
import { firebaseDatabase, firebaseAuth } from '../firebase'
import RetosList from '../components/RetosList'
const widthScreen = Dimensions.get('window').width
const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE = 80
export default class PerfilTab extends React.Component {

  constructor() {
    super()
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    this.state = {
      photo: photoURL,
      nombre_usuario: displayName,
      retos: [],
    }
  }
  componentWillMount() {

    this.getRetosRef().on('child_added', this.addReto);

  }
  componentWillUnmount() {
    this.getRetosRef().off('child_added', this.addReto);
  }
  addReto = (data) => {
    const reto = data.val()

    reto['id'] = data.key
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    const fechaActual = new Date()
    const fechaReto = new Date(reto.fecha_sistema_eva + " " + reto.horaReto)
    if (reto.participantes[uid] && (fechaReto - fechaActual < 0)) {
      this.setState({
        retos: this.state.retos.concat(reto),
        isLoading: false
      })
      console.log(this.state.retos)
    }
  }
  getRetosRef = () => {
    const { uid } = firebaseAuth.currentUser
    return firebaseDatabase.ref('retos/').orderByChild('fecha_sistema');
  }
  render() {
    const { nombre_usuario, photo, retos } = this.state

    return (<View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.titleToolbar}>Mi Perfil</Text>
          <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
          

        </View>
      </View>

      <View style={{ marginTop: 20, }}>
        <View style={{ alignItems: 'center' }}>
          {
            photo ?
              <Image style={styles.avatar} source={{ uri: photo }} /> :
              <Image style={styles.avatar} source={{ uri: DEFAULT_AVATAR }} />
          }
          <Text style={styles.nombre}>{nombre_usuario}</Text>
          <TouchableOpacity onPress={()=>Actions.perfilEdicion()}
             style={{ flexDirection:'row',alignItems:'center', padding: 5, }}>
            <Icon name="md-create" size={30} />
            <Text>Editar</Text>
          </TouchableOpacity>


        </View>
      </View>
      <Text style={styles.titulos}>Challenges Participados</Text>
      {retos.length == 0 && <Text style={styles.error}>No se encontraron Challenges a los cuales haya participado</Text>}
      <RetosList retos={retos} />

    </View>)
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulos: {
    fontWeight: "900",
    marginTop: 20,
    marginLeft: 5,
    fontSize: 18,
    color: '#535B9F'
  },
  error: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
    marginTop: 15,
  },
  containerNuevo: {
    padding: 10,
    backgroundColor: '#FFF',
    margin: 0,
  },
  titleApp: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    opacity: 0.8,
    textShadowColor: '#EC268F'
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