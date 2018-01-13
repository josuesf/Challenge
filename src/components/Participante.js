import React from 'react'
import {
    Text,
    StyleSheet,
    View,
    Image,
} from 'react-native'

const DEFAULT_AVATAR='https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE=22

const Participante = (props) =>
    <View style={styles.participante}>
        {
            props.avatar ?
            <Image style={styles.avatar} source={{uri:props.avatar}} />:
            <Image style={styles.avatar} source={{uri:DEFAULT_AVATAR}} />
        }
        
        <Text style={styles.text}>{props.nombre.split(" ")[0]}</Text>
    </View>
    

const styles = StyleSheet.create({
    participante:{
        backgroundColor:'#FFF',
        padding:0,
        margin:5,
        borderRadius:5,
        flexDirection:'column',
    },
    avatar:{
        width:AVATAR_SIZE,
        height:AVATAR_SIZE,
        borderRadius:AVATAR_SIZE/2,
    },
    text:{
        fontSize:9,
        flexWrap: 'wrap',
        textAlign:'left',
        fontWeight:'bold'
    }
})

export default Participante;