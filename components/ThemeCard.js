import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import ThemePie from './ThemePie'

export default class ThemeCard extends React.Component {

  state = {
    collapsed: true,
    selected: 0,
  };

  onButtonPress() {
    console.log("Pressed");
    console.log(this.props.themes[0])
    this.setState({selected: this.state.selected += 1});
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={{flex: 1, flexDirection: 'row', minHeight: 200}}>
          <Card image={require('../images/color.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.themes[this.state.selected].colors[0], borderColor: this.props.themes[this.state.selected].colors[0]}]}>
          </Card>
        </TouchableOpacity>
        <Collapsible collapsed={this.state.collapsed} style={{backgroundColor: '#424242'}}>
          <View style={styles.viewStyle}>
            <ThemePie theme={this.props.themes[0]}/>
            <ThemePie theme={this.props.themes[0]}/>
          </View>
          <View style={styles.viewStyle}>
            <ThemePie theme={this.props.themes[0]}/>
            <ThemePie theme={this.props.themes[0]}/>
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
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 200,
  },
});
