
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
} from 'react-native';

import RetoBox from './RetoBox'
import { Actions } from 'react-native-router-flux';

export default class RetosList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds
    }
  }
  componentDidMount() {
    this.updateDataSource(this.props.retos)
  }
  componentWillReceiveProps(newProps) {
    if (newProps.retos !== this.props.retos) {
      this.updateDataSource(newProps.retos)
    }
  }
  updateDataSource = data => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })
  }
  VerReto = (reto) => {
    Actions.detalleReto({ reto: reto })
  }
  render() {

    return (
      <ListView

        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={(reto) => {
          return (
            <TouchableOpacity onPress={() => this.VerReto(reto)}>
              <RetoBox reto={reto} />
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

