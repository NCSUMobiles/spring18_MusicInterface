import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';

export default class ThemeCard extends React.Component {

  onButtonPress() {
    console.log("Pressed");
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={{flex: 1, flexDirection: 'row', minHeight: 200}}>
        <Card image={require('../images/card.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: "#bada55", borderColor: "#89a725"}]}>
        </Card>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },
});
