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
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Ionicons'
import MapView from 'react-native-maps';
import store from '../store'
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -13.5281034;
const LONGITUDE = -71.9465414;
const LATITUDE_DELTA = 0.0043;
const LONGITUDE_DELTA = 0.0034;
const SPACE = 0.01;
export default class mapaDetalle extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.initialPosition)
        this.state = {
            initialPosition:this.props.initialPosition,
            markerPosition: this.props.initialPosition
        }
    }


    

    seleccionarPosicion = (eventName, e) => {
        console.log(eventName, e.nativeEvent);
        var initialRegion = {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({
            initialPosition: initialRegion,
            markerPosition: e.nativeEvent.coordinate
        })
    }
    volver = () => {
        
        Actions.pop()
    }

    takeSnapshot() {
        const snapshot = this.map.takeSnapshot({
            width: 300,      // optional, when omitted the view-width is used
            height: 300,     // optional, when omitted the view-height is used
            //region: {..},    // iOS only, optional region to render
            format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });
        snapshot.then((uri) => {
            this.setState({ mapSnapshot: uri });
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <MapView

                    zoomEnabled={true}
                    showsMyLocationButton={true}
                    provider={this.props.provider}
                    ref={ref => { this.map = ref; }}
                    style={styles.map}
                    region={this.state.initialPosition}

                >
                    <MapView.Marker
                        draggable
                        onDragEnd={(e) => this.seleccionarPosicion('onDragEnd', e)}
                        coordinate={this.state.markerPosition}
                    />

                </MapView>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.volver()}
                        style={{ justifyContent: 'center', marginTop: 20, marginBottom: 10, alignItems: 'center' }}>
                        <Icon size={50} color="#16a085" name="md-arrow-back" />
                        <Text style={{ color: '#16a085' }}>Volver</Text>
                    </TouchableOpacity>
                    
                </View>
                {this.state.mapSnapshot &&
                    <TouchableOpacity
                        style={[styles.container, styles.overlay]}
                        onPress={() => this.setState({ mapSnapshot: null })}
                    >
                        <Image

                            source={{ uri: this.state.mapSnapshot }}
                            style={{ width: 300, height: 300 }}
                        />
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

mapaDetalle.propTypes = {
    provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    button: {
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'column',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    buttonInfo: {
        marginBottom:height-250,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
});