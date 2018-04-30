import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Pie from 'react-native-pie'

export default class ThemePie extends React.Component {
  // pecentage of pie to show each color
  sliceVal = 100/6.0;
  // Render a Pie component with the appropriate theme's colors
  render() {
    return (
      <View style={styles.gridItem}>
        <Pie
          radius={Dimensions.get('window').width/6}
          innerRadius={Dimensions.get('window').width/10}
          series={[this.sliceVal, this.sliceVal, this.sliceVal, this.sliceVal, this.sliceVal, this.sliceVal]}
          colors={this.props.theme.colors} />
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
