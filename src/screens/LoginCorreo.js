

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import firebase, {
    firebaseAuth
} from "../firebase";

const widthScreen = Dimensions.get('window').width
const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
const AVATAR_SIZE = 120
export default class LoginCorreo extends Component {
    constructor() {
        super();

        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this.state = {
            email: "",
            password: "",
            credencialsUser: null,
            logueando: false,
            errorLogueo: false,
        }
    }


    componentWillMount() {
        AsyncStorage.getItem("DatosPersonales")
            .then(req => JSON.parse(req))
            .then(json => {
                if (json != null) {
                    this.setState({
                        email: json.email,
                    })
                }
            })
    }
    registrarYLoguear = () => {
        this.setState({ logueando: true })
        const { email, password } = this.state
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(datos => {
                firebaseAuth.signInWithEmailAndPassword(email, password)
                    .then(datos => {
                        firebaseAuth.onAuthStateChanged((user) => {
                            if (user) {
                                // User is signed in.
                                var displayName = user.displayName;
                                var email = user.email;
                                var emailVerified = user.emailVerified;
                                var photoURL = user.photoURL;
                                var isAnonymous = user.isAnonymous;
                                var uid = user.uid;
                                var providerData = user.providerData;
                                // ...
                                const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
                                console.log("entro aqui")
                                this.setState({
                                    logueando: false,
                                    credentialsUser: {
                                        uid: uid,
                                        displayName: displayName,
                                        email: email,
                                        photoURL: photoURL == null ? DEFAULT_AVATAR : photoURL,
                                    }
                                })
                                const cred = {
                                    uid: uid,
                                    displayName: displayName,
                                    email: email,
                                    photoURL: photoURL == null ? DEFAULT_AVATAR : photoURL,
                                }
                                AsyncStorage.setItem('CREDENTIALS', JSON.stringify(cred))
                                    .then(res => {
                                        AsyncStorage.getItem('DatosPersonales').then(req => JSON.parse(req))
                                            .then(json => {
                                                if (json == null) {
                                                    Actions.perfilEdicion()
                                                } else {
                                                    Actions.home()
                                                }
                                            })
                                    })

                            } else {
                                // User is signed out.
                                // ...
                            }
                        });
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ...
                        this.setState({ logueando: false })
                    });

            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                if (errorCode == "auth/invalid-email") {
                    this.setState({ logueando: false, errorLogueo: true })
                }
                if ("auth/email-already-in-use" == errorCode) {
                    firebaseAuth.signInWithEmailAndPassword(email, password)
                        .then(datos => {
                            firebaseAuth.onAuthStateChanged((user) => {
                                if (user) {
                                    // User is signed in.
                                    var displayName = user.displayName;
                                    var email = user.email;
                                    var emailVerified = user.emailVerified;
                                    var photoURL = user.photoURL;
                                    var isAnonymous = user.isAnonymous;
                                    var uid = user.uid;
                                    var providerData = user.providerData;
                                    // ...
                                    const DEFAULT_AVATAR = 'https://flipagram.com/assets/resources/img/fg-avatar-anonymous-user-retina.png'
                                    console.log("entro aqui")
                                    this.setState({
                                        logueando: false,
                                        credentialsUser: {
                                            uid: uid,
                                            displayName: displayName,
                                            email: email,
                                            photoURL: photoURL == null ? DEFAULT_AVATAR : photoURL,
                                        }
                                    })
                                    const cred = {
                                        uid: uid,
                                        displayName: displayName,
                                        email: email,
                                        photoURL: photoURL == null ? DEFAULT_AVATAR : photoURL,
                                    }
                                    AsyncStorage.setItem('CREDENTIALS', JSON.stringify(cred))
                                        .then(res => {
                                            AsyncStorage.getItem('DatosPersonales').then(req => JSON.parse(req))
                                                .then(json => {
                                                    if (json == null) {
                                                        Actions.perfilEdicion()
                                                    } else {
                                                        Actions.home()
                                                    }
                                                })
                                        })

                                } else {
                                    // User is signed out.
                                    // ...
                                }
                            });
                        })
                        .catch((error) => {
                            // Handle Errors here.
                            console.log(error)
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            if (errorCode) {
                                this.setState({ logueando: false, errorLogueo: true })
                            }
                            // ...
                        });
                }
                // ...
            });

    }

    render() {
        const { email, password, errorLogueo } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo}
                        source={require('../imgs/logoPeque.png')} />
                </View>
                {this.state.logueando && <ActivityIndicator size="large" />}
                {errorLogueo && <Text style={{ color: "red" }}>Revise su correo y contrasena</Text>}
                <TextInput style={{ width: widthScreen - 20 }} value={email} placeholder={"Escriba Email"}
                    onChangeText={(text) => this.setState({ email: text })} />
                <TextInput secureTextEntry={true} style={{ width: widthScreen - 20 }} value={password} placeholder={"Escriba Contrasena"}
                    onChangeText={(text) => this.setState({ password: text })} />
                <View style={{ marginTop: 40 }}>
                    <Button onPress={() => this.registrarYLoguear()} color={"#535B9F"} title="Registrar o Ingresar"></Button>
                </View>

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
    },
    logo: {
        width: 100,
        height: 100,
    },

    logoContainer: {
        marginBottom: 50,
    }
});