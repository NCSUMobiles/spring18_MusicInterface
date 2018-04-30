import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import User from './User';

export default class UserRow extends React.Component {
  // returns a User component with the appropriate backgroundColor
  allBoxes() {
    return this.props.data.map((user, i) => {
      return(
        <User
          key={i}
          data={user}
          backgroundColor={this.props.colors[i]}
          blobColors={this.props.blobColors}
          updateBlobColor={this.props.updateBlobColor}/>
      )
    })
  }

  // simply renders Users in the row
  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 200,
      }}>
        {this.allBoxes()}
      </View>
    );
  }
}
