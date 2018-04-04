import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import { StackRouter } from 'react-navigation';
import GridLayout from './components/GridLayout';

// Set up transition/stack router
const stackRouter = StackRouter{ (
  gridLayout: {
    screen: GridLayout
  },
  LandingPage: {
    screen: LandingPage
  }
  }, {
  headerMode: 'none',
  initialRouteName: 'gridLayout'
)}

const navigator = createNavigationContainer(createNavigator(stackRouter)(BubbleTransition))
// TODO: add to store so it can be accessed...or make it a prop?

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GridLayout />
        <GridLayout />
        <GridLayout />
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
