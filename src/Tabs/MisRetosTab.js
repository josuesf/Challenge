import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Toolbar from 'react-native-toolbar';
import { firebaseDatabase, firebaseAuth } from '../firebase'
import RetosList from '../components/RetosList'
export default class MisRetosTab extends React.Component {
  constructor() {
    super()
    this.state = {
      retos: [],
      isLoading: false,
    }
  }
 

  componentWillMount() {

    this.getRetosRef().on('child_added', this.addReto);
    this.getRetosRef().on('child_changed', this.addReto);

  }
  componentWillUnmount() {
    this.getRetosRef().off('child_added', this.addReto);
    this.getRetosRef().off('child_changed', this.addReto);
  }
  addReto = (data) => {
    const reto = data.val()
    reto['id'] = data.key
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    const fechaActual= new Date()
    const fechaReto= new Date(reto.fecha_sistema_eva+" "+reto.horaReto)
    if (reto.participantes[uid]&&(fechaReto-fechaActual>=0)) {
      this.setState({
        retos: this.state.retos.concat(reto),
        isLoading: false
      })
    }else{
      if(!reto.participantes[uid]){
        this.setState({
          retos: this.state.retos.filter((r)=>{
            return r && r.id!=reto.id
          }),
        })
      }
    }
  }
  getRetosRef = () => {
    const { uid } = firebaseAuth.currentUser
    return firebaseDatabase.ref('retos/').orderByChild('fecha_sistema');
  }
  render() {
    const BLUE_LINK = '#535B9F'
    const { retos } = this.state
    return (
      <View style={styles.container} >
        <View style={styles.toolbar}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.titleToolbar}>Mis retos pendientes</Text>
            <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
          </View>
        </View>
        <View>
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