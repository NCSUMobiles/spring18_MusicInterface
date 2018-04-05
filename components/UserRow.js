import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import User from './User';

export default class UserRow extends React.Component {
  allBoxes() {
    return this.props.data.map((row, i) => {
      return(
        <User key={i} data={row}/>
      )
    })
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {this.allBoxes()}
      </View>
    );
  }
}
