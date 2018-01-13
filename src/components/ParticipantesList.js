
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    TouchableOpacity,
    Alert
} from 'react-native';

import Participante from './Participante'
import { firebaseDatabase, firebaseAuth } from '../firebase'

export default class ParticipantesList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds
        }
    }
    componentDidMount() {
        this.updateDataSource(this.props.participantes)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.participantes !== this.props.participantes) {
            this.updateDataSource(newProps.participantes)
        }
    }
    updateDataSource = data => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data)
        })
    }
    getRetoRef = () => firebaseDatabase.ref('retos/' + this.props.id)
    getParticipante = (id) => firebaseDatabase.ref('retoParticipantes/' + this.props.id + "/" + id)
    eliminarParticipante = (participante) => {
        /*this.getRetoRef().transaction(function (reto) {
            const uid = participante.id_user
            if (reto) {
                if (reto.participantes && reto.participantes[uid]) {
                    reto.numero_paricipantes++;
                    reto.participantes[uid] = null;
                } else {
                    reto.numero_paricipantes--;
                    if (!reto.participantes) {
                        reto.participantes = {};
                    }
                    reto.participantes[uid] = {
                        nombre: displayName,
                        photo: photoURL
                    };
                }
            }
            return reto;
        });*/
        this.getParticipante(participante.id).transaction(function (p) {

            if (p) {
                p.activo = false
                p.fuisteEliminado=true
            }
            return p;
        })
    }
    onPressEliminarParticipante = (participante) => {
        if (this.props.esCreador) {
            if (!participante.esCreador) {
                Alert.alert(
                    'Espere',
                    'Esta seguro de eliminar a ' + participante.nombre,
                    [
                        { text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'SI', onPress: () => this.eliminarParticipante(participante) },
                    ],
                    { cancelable: false }
                )
            }
        }

    }
    render() {

        return (
            <ListView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(participante) => {
                    console.log(participante)
                    return (
                        <TouchableOpacity onPress={() => this.onPressEliminarParticipante(participante)}>
                            <Participante nombre={participante.nombre} avatar={participante.photo} />
                        </TouchableOpacity>
                    )
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        paddingTop: 50
    }

});

