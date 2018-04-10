import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button, Slider } from 'react-native-elements';
import Pie from 'react-native-pie'

export default class ThemePie extends React.Component {
  sliceVal = 100/6.0;
  render() {
    return (
      <View style={styles.gridItem}>
        <Pie
          radius={100}
          innerRadius={60}
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
