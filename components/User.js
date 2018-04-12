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
    console.log(this.props.background)
    return (
      <View style={{flex: this.props.data.flexSize, flexDirection: 'column'}}>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
          <Card image={require('../images/person2.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.backgroundColor, borderColor: this.props.backgroundColor}]}>
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
    paddingTop: 10,
  },
});
