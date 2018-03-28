import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import GridLayout from './components/GridLayout';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GridLayout />
        <GridLayout />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
