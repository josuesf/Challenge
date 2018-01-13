
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
} from 'react-native';

import Participante from './Participante'

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
    render() {

        return (
            <ListView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(participante) => {
                    return (
                        <Participante nombre={participante.nombre} avatar={participante.photo} />
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

