import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import GridItem from './GridItem';

export default class GridLayout extends React.Component {
  allBoxes() {
    return this.props.data.map((row, i) => {
      return(
        <GridItem key={i} data={row}/>
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
