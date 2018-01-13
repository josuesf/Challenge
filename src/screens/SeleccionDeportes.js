<<<<<<< HEAD
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
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase, {
  firebaseAuth
} from "../firebase";


export default class SeleccionDeportes extends Component {
  constructor() {
    super();

    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
    }
  }
  

  componentWillMount() {
  }
  
  
  render() {
    return (
      <View style={styles.container}>
        
        
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

=======
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
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';

import FBSDK, {
    LoginButton,
    AccessToken
} from 'react-native-fbsdk'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import store from '../store'
const widthScreen = Dimensions.get('window').width

var deportesBD = [
    {
        name:"Futbol"
    },
    {
        name:"Baloncesto"
    },
    {
        name:"Voleyball"
    },
    {
        name:"Tennis"
    },
    {
        name:"Handbol"
    },
    {
        name:"Beisbol"
    },
    {
        name:"Softbol"
    },
    {
        name:"Bowling"
    },
    {
        name:"Cricket"
    },
    {
        name:"Futbol Americano"
    },
    {
        name:"Rugby"
    },
    {
        name:"Paintball"
    },
]

var numberSelected = 0
export default class Perfil extends Component {
    constructor() {
        super()
        this.state = {
            estaSelecionados: false,
        }
    }
    componentDidMount(){
        store.subscribe(() => {
                this.setState({
                    estaSelecionados:store.getState().deportesValidacion
                })
          })
    }
    render() {
        return (
            <View style={styles.ViewPerfil}>
                <View style={{height: 50, paddingHorizontal:20,paddingTop:3,paddingBottom:3, borderColor:'#535B9F', borderBottomWidth:2}}>
                    <Text style={{fontSize: 30, color: '#FF80AB'}}>Seleccione 3 deportes:</Text>
                </View>
                <ScrollView>
                    {deportesBD.map((el,i) =><Deporte deport={el.name} key={i}/>
                    )}
                </ScrollView>
                {this.state.estaSelecionados && 
                    <TouchableOpacity style={{flexDirection:'row', height:50, backgroundColor:'#535B9F', alignItems:'center'}}>
                    <Text style={{fontSize:30, color:'white', paddingRight: 20, paddingLeft: widthScreen*2/4}}>
                        Siguiente
                    </Text>
                    <Icon name={"md-send"} color='white' size={30}/>
                </TouchableOpacity>}
            </View>
        );
    }
}

class Deporte extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false,
        }
    }
    _onPressButton = () => {
        if(numberSelected < 3 || this.state.selected){
            
            this.setState({
                selected: !this.state.selected
            })
            numberSelected += this.state.selected? -1: 1
        }else{
            Alert.alert("Solo pudes seleccionar 3 deportes")
        }
        if(numberSelected == 3){
            store.dispatch({
                type: 'DEPORTES_VALIDACION',
                deportesValidacion: true
            })
        }else{
            store.dispatch({
                type: 'DEPORTES_VALIDACION',
                deportesValidacion: false
            })
        }
    }
    render() {
        return (
            <View  style={styles.ViewDeporte}>
                <TouchableOpacity style={styles.TouchableDeporte} onPress={this._onPressButton}>
                    <Text style={styles.TextTouchableDeporte}>{this.props.deport}</Text>
                    {this.state.selected && <Icon name={"md-checkmark"} color="green" size={25}/>}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewDeporte:{
        paddingHorizontal:20, 
        paddingVertical:5, 
        borderBottomColor: 'black',
        borderBottomWidth:1
    },
    TouchableDeporte:{
        alignItems: 'center', 
        height: 50, 
        flexDirection:'row'
    },
    TextTouchableDeporte:{
        marginRight: 20, 
        color: 'black',
        alignContent: 'center', 
        width: widthScreen*3/4
    },
    ViewPerfil:{ 
        flex: 1 
    }
>>>>>>> 83298d537dfb6be6eb10a66d29602a1cb4667885
});
