import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import ThemePie from './ThemePie'

export default class ThemeCard extends React.Component {

  state = {
    collapsed: true
  };

  onButtonPress() {
    //console.log("Pressed");
    this.setState({collapsed: !this.state.collapsed});
  }

  onPiePress(choice) {
    this.props.updateTheme(choice);
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={{flex: 1, flexDirection: 'row', minHeight: 200}}>
          <Card image={require('../images/color.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.themes[this.props.selected].colors[0], borderColor: this.props.themes[this.props.selected].colors[0]}]}>
          </Card>
        </TouchableOpacity>
        <Collapsible collapsed={this.state.collapsed} style={{backgroundColor: '#424242'}}>
          <View style={styles.viewStyle}>
            <TouchableOpacity onPress={this.onPiePress.bind(this, 0)}>
              <ThemePie theme={this.props.themes[0]}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPiePress.bind(this, 1)}>
              <ThemePie theme={this.props.themes[1]}/>
            </TouchableOpacity>
          </View>
          <View style={styles.viewStyle}>
            <TouchableOpacity onPress={this.onPiePress.bind(this, 2)}>
              <ThemePie theme={this.props.themes[2]}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPiePress.bind(this, 3)}>
              <ThemePie theme={this.props.themes[3]}/>
            </TouchableOpacity>
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
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 200,
  },
});
