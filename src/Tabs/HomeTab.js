import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  AppState
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Toolbar from 'react-native-toolbar';
import store from '../store'
import { firebaseDatabase, firebaseAuth } from '../firebase'
import RetosList from '../components/RetosList'
export default class HomeTab extends React.Component {
  constructor() {
    super()
    this.state = {
      retos: [],
      isLoading: false,
      appState: AppState.currentState,
    }
    
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillMount() {
    
    this.getRetosRef().on('child_added', this.addReto);

  }
  componentWillUnmount() {
    this.getRetosRef().off('child_added', this.addReto);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
      
      console.log(nextAppState)
  }
  addReto = (data) => {
    
    const reto = data.val()
    reto['id'] = data.key
    const fechaActual= new Date()
    const fechaReto= new Date(reto.fecha_sistema_eva+" "+reto.horaReto)
    if (fechaReto-fechaActual>=0) {
      this.setState({
        retos: this.state.retos.concat(reto),
        isLoading: false
      })
    }
  }
  getRetosRef = () => {
    return firebaseDatabase.ref('retos/').orderByChild('fecha_sistema');
  }
  render() {
    const BLUE_LINK = '#535B9F'
    const { retos } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.titleToolbar}>Mis Challenges</Text>
            <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
          </View>
        </View>
        <View >
          {retos.length==0&&<Text style={styles.error}>No se encontraron Challenges disponibles</Text>}
          <RetosList retos={retos} />
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 55,
  },
  error:{
    fontSize:12,
    color:'#000',
    marginLeft:5,
    marginTop:15,
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
});