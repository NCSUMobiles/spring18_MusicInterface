import React from 'react';
import { StyleSheet, Text, View, Slider } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';

export default class SlidingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingName: "Setting 1",
      settingVal: 5
    };
  }

  onSlidingComplete( val ) {
    this.state.settingVal = val;
    console.log(this.state.settingVal);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.setting1} </Text>
        <Slider
          style: {{width: 300}}
          step: {1}
          minimumValue: 0
          maximumValue: 10
          value: this.state.settingVal
          onSlidingComplete: { val => this.onSlidingComplete(val) }
        />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
