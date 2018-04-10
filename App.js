import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import UserRow from './components/UserRow';
import ThemeCard from './components/ThemeCard'
import data from './data.json'

export default class App extends React.Component {constructor() {
  super();
    this.state = {
      users: data.blobs,
      theme: data.theme
    }
  }

  allUsers() {
    return this.state.users.map((row, i) => {
      return(
        <UserRow key={i} data={row.row}/>
      )
    })
  }

  render() {
    console.log(this.state.theme);
    return(
      <ScrollView style={{flex: 1}}>
        <ThemeCard themes={this.state.theme}/>
        {this.allUsers()}
      </ScrollView>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
