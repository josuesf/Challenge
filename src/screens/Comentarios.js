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
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons'
import { firebaseDatabase, firebaseAuth } from '../firebase'
import CommentList from '../components/CommentList'
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0043;
const LONGITUDE_DELTA = 0.0034;
export default class DetalleReto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            text:"",
        }
    }
    componentWillMount(){
        AsyncStorage.getItem("DatosPersonales")
        .then(req => JSON.parse(req))
        .then(json => {
          if (json != null) {
            this.setState({
              photoCreador: json.photo,
              creador: json.nombre_usuario,
            })
          }
        })
    }
    componentDidMount() {
        this.getRetoCommentsRef().on('child_added', this.addComment);
    }
    componentWillUnmount() {
        this.getRetoCommentsRef().off('child_added', this.addComment);
    }
    addComment = (data) => {
        const comment = data.val()
        this.setState({
            comments: this.state.comments.concat(comment)
        })
    }
    
    handleSend = () => {
        const text = this.state.text
        const { uid } = firebaseAuth.currentUser
        const {creador,photoCreador}=this.state
        const retoCommentsRef = this.getRetoCommentsRef()
        var newCommentRef = retoCommentsRef.push();
        newCommentRef.set({
            text,
            userPhoto: photoCreador,
            uid,
            displayName:creador
        });
        this.setState({ text: '' })

    }
    handleChangeText = (text) => this.setState({ text })
    getRetoCommentsRef = () => {
        const { id } = this.props.reto
        return firebaseDatabase.ref('commentsRetos/' + id)
    }
    render() {
        const reto = this.props.reto
        const { comments, } = this.state

        return (
            <View behavior="padding" style={styles.container}>
                
                <CommentList comments={comments} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={this.state.text}
                        placeholder="Escribe un comentario..."
                        onChangeText={this.handleChangeText}
                    />
                    <TouchableOpacity onPress={this.handleSend} 
                        style={{backgroundColor:"#6948A9",alignItems:'center',borderRadius:70,width:50,height:50,}}>
                        <Icon name="md-send" size={35} color="white" style={{marginTop:6,marginLeft:3}}/>
                    </TouchableOpacity>
                </View>

            </View>
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
        borderRadius:20,
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
        paddingBottom:3,
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