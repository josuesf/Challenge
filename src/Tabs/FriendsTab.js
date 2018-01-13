import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Toolbar from 'react-native-toolbar';
import { firebaseDatabase, firebaseAuth } from '../firebase'

const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE = 120
export default class FriendsTab extends React.Component {
  constructor() {
    super()
    const { uid, photoURL, displayName } = firebaseAuth.currentUser
    this.state = {
      amigos: [],
      isLoading: false,
      uid:uid
    }
  }


  componentWillMount() {
    this.getAmigos().on('child_added', this.addAmigo);//child_changed
  }
  componentWillUnmount() {
    this.getAmigos().off('child_added', this.addAmigo);
  }
  addAmigo = (data) => {
    
    const amigo = data.val()
    this.setState({
      amigos: this.state.amigos.concat(amigo)
    })
    
  }
  getAmigos = () => {
    return firebaseDatabase.ref('amigosUsuario/'+this.state.uid)
  }
  
  render() {
    
    return (
      <View style={styles.container} >
        <View style={styles.toolbar}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.titleToolbar}>Mis amigos</Text>
            <Image style={styles.image} source={require('../imgs/logoOficial.png')} />
          </View>
        </View>
        <FlatList
          data={this.state.amigos}
          renderItem={({ item }) => (
            <View style={{ padding: 10,flexDirection:'row',alignItems:'center' }}>
              <Image defaultSource={{uri:DEFAULT_AVATAR}} source={{uri:item.photo}} style={{height:30,width:30,padding:10}}/>
              <Text style={{color:'#333',fontSize:15,}}>{item.nombre}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 55,
  },
  error: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
    marginTop: 15,
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