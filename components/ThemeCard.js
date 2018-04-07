import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

export default class ThemeCard extends React.Component {

  state = {
    collapsed: true,
  };

  onButtonPress() {
    console.log("Pressed");
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={{flex: 1, flexDirection: 'row', minHeight: 200}}>
          <Card image={require('../images/card.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: "#bada55", borderColor: "#89a725"}]}>
          </Card>
        </TouchableOpacity>
        <Collapsible collapsed={this.state.collapsed} style={{backgroundColor: '#424242'}}>
          <View style={{margin: 20}}>
            <Text style={{color: "white"}}>HI</Text>
            <Slider></Slider>
          </View>
        </Collapsible>
      </View>
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
