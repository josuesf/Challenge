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
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import RetoBox from '../components/RetoBox'
import Icon from 'react-native-vector-icons/Ionicons'
import { firebaseDatabase, firebaseAuth } from '../firebase'
import CommentList from '../components/CommentList'
import ParticipantesList from '../components/ParticipantesList'
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0043;
const LONGITUDE_DELTA = 0.0034;
export default class DetalleReto extends Component {
    constructor(props) {
        super(props)
        const latitud = this.props.reto.latitude
        const longitud = this.props.reto.longitude
        const { uid, photoURL, displayName } = firebaseAuth.currentUser
        const reto_ = this.props.reto
        var esParticipante_ = false
        if (this.props.reto.participantes[uid])
            esParticipante_ = true
        var esCreador_ = false
        if (uid == this.props.reto.id_creador)
            esCreador_ = true
        this.state = {

            comments: [],
            nro_participantes: [],
            initialPosition: {
                latitude: latitud,
                longitude: longitud,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markerPosition: {
                latitude: latitud,
                longitude: longitud,
            },
            esParticipante: esParticipante_,
            numero_paricipantes: this.props.numero_paricipantes,
            hayCupos: true,
            esCreador: esCreador_,
            reto: reto_,
            uid: uid,
        }
    }

    componentDidMount() {
        this.getRetoRef().on('child_changed', this.changeReto);
        this.getRetoCommentsRef().on('child_added', this.addComment);
        this.getRetosParticipantesRef().on('child_added', this.addParticipante);
        this.getRetosParticipantesRef().on('child_changed', this.changeParticipante);
        
    }
    componentWillUnmount() {
        this.getRetoRef().off('child_changed', this.changeReto);
        this.getRetoCommentsRef().off('child_added', this.addComment);
        this.getRetosParticipantesRef().off('child_added', this.addParticipante);
        this.getRetosParticipantesRef().off('child_changed', this.changeParticipante);
        this.getEstadoParticipante().off('value',this.estadoReto)
    }
    componentWillMount() {
        const { uid } = firebaseAuth.currentUser
        this.getParticipantesRef().on('value', snapshot => {
            const participantes = snapshot.val()
            console.log(participantes)
            if (participantes[uid]) {
                this.setState({
                    esParticipante: true,
                })
            }else{
                this.setState({
                    esParticipante: false,
                })
            }
        })
        this.getNroParticipantesRef().on('value', snapshot => {
            const reto = snapshot.val()
            if (reto) {
                this.setState({
                    numero_paricipantes: reto,
                    hayCupos: reto > 0 ? true : false
                })
            }
        })
        this.getEstadoParticipante().on('value',this.estadoReto)
        
    }
    estadoReto=(snapshot)=>{
        const p=snapshot.val()
        
            if(p && p.fuisteEliminado){
                this.getRetoRef().transaction((reto)=> {
                    const uid = this.state.uid
                    if (reto) {
                        reto.participantes[uid] = null;
                    }
                    return reto;
                });
                this.getEstadoParticipante().transaction(function (p) {
                    if (p) {
                        p.fuisteEliminado=false
                    }
                    return p;
                })
                Alert.alert('Lo sentimos','Usted fue eliminado de este challenge')
            }
    }
    changeReto = (data) => {
        var reto_ = this.state.reto
        reto_[data.key] = data.val()
        this.setState({ reto: reto_, esParticipante: reto_.participantes[this.state.uid] })
    }
    addComment = (data) => {
        const comment = data.val()
        this.setState({
            comments: this.state.comments.concat(comment)
        })
    }
    changeParticipante = (data) => {
        const participante = data.val()

        participante["id"] = data.key
        if (!participante.activo)
            this.setState({
                nro_participantes: this.state.nro_participantes.filter(p => p.id != participante.id)
            })
        else {
            this.setState({
                nro_participantes: this.state.nro_participantes.concat(participante)
            })
        }
        //console.log(this.state.nro_participantes)
    }
    addParticipante = (data) => {
        const participante = data.val()
        participante["id"] = data.key
        if (participante.id_user == this.props.reto.id_creador)
            participante["esCreador"] = true
        else {
            participante["esCreador"] = false
        }
        if (participante["activo"])
            this.setState({
                nro_participantes: this.state.nro_participantes.concat(participante)
            })
    }
    handleSend = () => {
        const text = this.state.text
        const { uid, photoURL, displayName } = firebaseAuth.currentUser
        const retoCommentsRef = this.getRetoCommentsRef()
        var newCommentRef = retoCommentsRef.push();
        newCommentRef.set({
            text,
            userPhoto: photoURL,
            uid,
            displayName
        });
        this.setState({ text: '' })

    }
    getRetoCommentsRef = () => {
        const { id } = this.props.reto
        return firebaseDatabase.ref('commentsRetos/' + id).limitToLast(3)
    }
    getParticipantesRef = () => {
        const { id } = this.props.reto
        return firebaseDatabase.ref('retos/' + id + '/participantes')
    }
    getNroParticipantesRef = () => {
        const { id } = this.props.reto
        return firebaseDatabase.ref('retos/' + id + '/numero_paricipantes')
    }
    AbrirMapa = () => {
        Actions.mapaDetalle({ initialPosition: this.state.initialPosition })
    }
    VerComentarios = () => {
        Actions.comentarios({ reto: this.props.reto })
    }
    handleChangeText = (text) => this.setState({ text })

    getRetoRef = () => firebaseDatabase.ref('retos/' + this.props.reto.id)

    participar = () => {
        if (this.state.numero_paricipantes > 0) {
            const { uid, displayName, photoURL } = firebaseAuth.currentUser
            this.getRetoRef().transaction(function (reto) {
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
            });
            this.getRetosParticipantesRef().transaction(function (participante) {
                if (participante) {
                    if (participante[uid]) {
                        participante[uid].activo = true
                    } else {
                        participante[uid] = {
                            id_user: uid,
                            nombre: displayName,
                            photo: photoURL,
                            activo: true,
                        }
                    }
                }
                return participante
            })
            this.getAmigosUsuario().transaction((usuario) => {
                if (usuario) {
                    usuario[uid] = {
                        id_user: uid,
                        nombre: displayName,
                        photo: photoURL,
                        activo: true,
                        fuisteEliminado:false
                    }
                }
                return usuario != null ? usuario :
                    {
                        [uid]: {
                            id_user: uid,
                            nombre: displayName,
                            photo: photoURL,
                            activo: true,
                            fuisteEliminado:false
                        }
                    }

            })
            this.setState({ esParticipante: true })

        }

    }
    getRetosParticipantesRef = () => {
        return firebaseDatabase.ref('retoParticipantes/' + this.props.reto.id + '/')
    }
    getEstadoParticipante= () => {
        return firebaseDatabase.ref('retoParticipantes/' + this.props.reto.id + '/'+this.state.uid+'/')
    }
    getAmigosUsuario = () => {
        return firebaseDatabase.ref('amigosUsuario/' + this.props.reto.id_creador + '/')
    }
    render() {
        const { comments, nro_participantes, esParticipante, hayCupos, esCreador, reto } = this.state
        
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>

                <RetoBox reto={reto} />
                <Text style={styles.titulos}>Ubicacion</Text>
                {reto.referenciaLugar != "" && <Text style={{ fontSize: 10, color: "#333" }}>Referencia: {reto.referenciaLugar}</Text>}
                <TouchableOpacity onPress={this.AbrirMapa} style={{
                    backgroundColor: "#FFF",
                    borderColor: "#16a085", borderWidth: 1
                    , alignItems: "center", flexDirection: "row", borderRadius: 10
                }}>
                    <Icon name="ios-pin-outline" size={20} color="#16a085" style={{ paddingRight: 5, paddingLeft: 10, paddingBottom: 5, paddingTop: 5, }} />
                    <Text style={{ color: "#16a085" }}>Ver la ubicacion</Text>
                </TouchableOpacity>
                <Text style={styles.titulos}>Participantes</Text>
                {esCreador && <Text style={{ fontSize: 10, color: "#333" }}>Toca para eliminar a un participante</Text>}

                <View style={styles.participantesBox}>
                    <ParticipantesList esCreador={esCreador} id={this.props.reto.id} participantes={nro_participantes} />

                    {hayCupos && !esParticipante && <TouchableOpacity
                        onPress={() => this.participar()}
                        style={{
                            width: 90, backgroundColor: "#2ecc71",
                            padding: 5, alignItems: "center", borderRadius: 5, flexDirection: "row"
                        }}>
                        <Text style={{ color: "white", fontWeight: "bold", marginRight: 5 }}>Participar</Text>
                        <Icon name="ios-football" size={20} color={"white"} />
                    </TouchableOpacity>}

                </View>

                <Text style={styles.titulos}>Comentarios</Text>
                <CommentList comments={comments} />
                <TouchableOpacity onPress={this.VerComentarios} style={{
                    backgroundColor: "#FFF",
                    borderColor: "#9b59b6", borderWidth: 1, marginBottom: 5, marginTop: 5,
                    alignItems: "center", flexDirection: "row", borderRadius: 10
                }}>
                    <Icon name="ios-chatbubbles-outline" size={20} color="#9b59b6" style={{ paddingRight: 5, paddingLeft: 10, paddingBottom: 5, paddingTop: 5, }} />
                    <Text style={{ color: "#9b59b6" }}>Ver mas comentarios</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 5,
        marginLeft: 5,
    },
    inputContainer: {
        borderRadius: 20,
        height: 50,
        backgroundColor: '#E8EDEE',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
    },
    header: {
        fontSize: 20,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    titulos: {
        fontWeight: "900",
        paddingBottom: 3,
    },
    participantesBox: {
        alignItems: 'center',
        margin: 5,
        marginRight: 0,
        marginLeft: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
            height: 1,
            width: -2
        },
        elevation: 2,
        padding: 5,
        height: 50,
    },
    map: {
        height: 80,

    },
});