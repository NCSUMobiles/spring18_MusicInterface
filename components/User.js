import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

export default class User extends React.Component {

  state = {
    collapsed: true,
  };

  onButtonPress() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    return (
      <View style={{flex: this.props.data.flexSize, flexDirection: 'column'}}>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
          <Card image={require('../images/card.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.data.backgroundColor, borderColor: this.props.data.borderColor}]}>
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
