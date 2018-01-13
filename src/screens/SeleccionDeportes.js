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
        name: "Futbol"
    },
    {
        name: "Baloncesto"
    },
    {
        name: "Voleyball"
    },
    {
        name: "Tennis"
    },
    {
        name: "Handbol"
    },
    {
        name: "Beisbol"
    },
    {
        name: "Softbol"
    },
    {
        name: "Bowling"
    },
    {
        name: "Cricket"
    },
    {
        name: "Futbol Americano"
    },
    {
        name: "Rugby"
    },
    {
        name: "Paintball"
    },
]

var numberSelected = 0
var deportes = []
export default class SeleccionDeportes extends Component {
    constructor() {
        super()
        this.state = {
            estaSelecionados: false,
        }
    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({
                estaSelecionados:store.getState().deportesValidacion,
                    deportes:store.getState().deportes
            })
        })
    }
    GuardarDeportes=()=>{
        AsyncStorage.setItem("Deportes", JSON.stringify(deportes))
        .then((res) => {
            Actions.replace("home")
        })
        .catch((err) => {
          alert(err)
        })
    }
    render() {
        return (
            <View style={styles.ViewPerfil}>
                <View style={{ height: 50, paddingHorizontal: 20, paddingTop: 3, paddingBottom: 3, borderColor: '#535B9F', borderBottomWidth: 2 }}>
                    <Text style={{ fontSize: 30, color: '#FF80AB' }}>Seleccione 3 deportes:</Text>
                </View>
                <ScrollView>
                    {deportesBD.map((el, i) => <Deporte deport={el.name} key={i} />
                    )}
                </ScrollView>
                {this.state.estaSelecionados &&
                    <TouchableOpacity onPress={() => this.GuardarDeportes()}
                        style={{ flexDirection: 'row', height: 50, backgroundColor: '#535B9F', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, color: 'white', paddingRight: 20, paddingLeft: widthScreen * 2 / 4 }}>
                            Siguiente
                    </Text>
                        <Icon name={"md-send"} color='white' size={30} />
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
    _onPressButton = (deporte) => {
        if (numberSelected < 3 || this.state.selected) {
            if (this.state.selected) {
                deportes = deportes.filter(d => d != deporte)
            } else {
                deportes = deportes.concat(deporte)
            }

            this.setState({
                selected: !this.state.selected
            })
            numberSelected += this.state.selected ? -1 : 1
        } else {
            Alert.alert("Solo pudes seleccionar 3 deportes")
        }
        if (numberSelected == 3) {
            store.dispatch({
                type: 'DEPORTES_VALIDACION',
                deportesValidacion: true
            })
            store.dispatch({
                type: 'ADD_DEPORTES',
                deportes: this.state.deportes
            })
        } else {
            store.dispatch({
                type: 'DEPORTES_VALIDACION',
                deportesValidacion: false
            })
        }
    }
    render() {
        return (
            <View style={styles.ViewDeporte}>
                <TouchableOpacity style={styles.TouchableDeporte} onPress={() => this._onPressButton(this.props.deport)}>
                    <Text style={styles.TextTouchableDeporte}>{this.props.deport}</Text>
                    {this.state.selected && <Icon name={"md-checkmark"} color="green" size={25} />}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewDeporte: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    TouchableDeporte: {
        alignItems: 'center',
        height: 50,
        flexDirection: 'row'
    },
    TextTouchableDeporte: {
        marginRight: 20,
        color: 'black',
        alignContent: 'center',
        width: widthScreen * 3 / 4
    },
    ViewPerfil: {
        flex: 1
    }
});
