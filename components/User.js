import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';

export default class User extends React.Component {

  onButtonPress() {
    console.log(this.props.data.title);
    console.log(this.props.data.category);
    console.log("Pressed");
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={{flex: this.props.data.flexSize, flexDirection: 'column'}}>
        <Card image={require('../images/card.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.data.backgroundColor, borderColor: this.props.data.borderColor}]}>
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
