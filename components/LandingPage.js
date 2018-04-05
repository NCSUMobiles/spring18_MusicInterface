import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import SliderComponent from './SliderComponent';

export default class LandingPage extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>User Name </Text>
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
