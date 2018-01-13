import React from 'react'
import {View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default class FriendsTab extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Amigos',
    tabBarIcon: () => (<Icon size={24} color="#535B9F" name="md-people" />)
  }
 
  render() {
      return (<View>

      </View>)
  }
}