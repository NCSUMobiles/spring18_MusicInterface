import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';

export default class GridLayout extends React.Component {

  onButtonPress() {
    console.log("Pressed");
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onButtonPress} style={{flex: 1}}>
        <Card image={require('../images/card.png')} imageProps={{resizeMode: 'contain'}}>
        </Card>
      </TouchableOpacity>
    );
  }
}
