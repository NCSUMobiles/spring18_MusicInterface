import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import SlidingComponent from './components/SlidingComponent';

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "User 1"
    };
  }
  // Do I need to maintain state for each slider component here?

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.userID} </Text>
        <SliderComponent />
        <SliderComponent />
        <SliderComponent />
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
