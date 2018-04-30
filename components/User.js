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
    //console.log(this.props);
  }

  onChangeColor(index) {
    this.props.updateBlobColor(this.props.data.index, index);
  }

  allColors() {
    return this.props.blobColors.map((blobColor, i) => {
      if (this.props.backgroundColor === blobColor)
        return(
          <TouchableOpacity style={{flex: 1, backgroundColor: blobColor, minHeight: 40, margin: 0, padding: 0, borderColor: '#fff', borderWidth: 2}} key={i}></TouchableOpacity>
        )
      else
        return(
          <TouchableOpacity onPress={this.onChangeColor.bind(this, i)} style={{flex: 1, backgroundColor: blobColor, minHeight: 40, margin: 0, padding: 0}} key={i}></TouchableOpacity>
        )
    })
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column' }}>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
          <Card image={require('../images/person2.png')} imageProps={{resizeMode: 'contain'}} containerStyle={[styles.gridItem, {backgroundColor: this.props.backgroundColor, borderColor: this.props.backgroundColor}]}>
          </Card>
        </TouchableOpacity>
        <Collapsible collapsed={this.state.collapsed} style={{backgroundColor: '#424242'}}>
          <View style={{marginTop: 20, marginBottom: 20, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {this.allColors()}
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
