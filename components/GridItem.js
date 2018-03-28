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
        <Card>
          <Image source={require('../images/card.png')}/>
        </Card>
      </TouchableOpacity>
    );
  }
}
