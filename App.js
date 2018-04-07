import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import UserRow from './components/UserRow';
import ThemeCard from './components/ThemeCard'

export default class App extends React.Component {constructor() {
  super();
    this.state = {
      rows: []
    }
  }

  componentWillMount() {
    this.setState({
      "users": [
        {
          "row": [
            {
              "title": "square1",
              "category": "img1",
              "flexSize": 2,
              "backgroundColor": "#bada55",
              "borderColor": "#89a725"
            },
            {
              "title": "square2",
              "category": "img2",
              "flexSize": 1,
              "backgroundColor": "#6699ff",
              "borderColor": "#1a66ff"
            }
          ]
        },
        {
          "row": [
            {
              "title": "square3",
              "category": "img3",
              "flexSize": 1,
              "backgroundColor": "#ff66cc",
              "borderColor": "#ff33bb"
            },
            {
              "title": "square4",
              "category": "img4",
              "flexSize": 1,
              "backgroundColor": "#ff9966",
              "borderColor": "#ff7733"
            },
            {
              "title": "square5",
              "category": "img5",
              "flexSize": 1,
              "backgroundColor": "#993399",
              "borderColor": "#732673"
            }
          ]
        },
        {
          "row": [
            {
              "title": "square1",
              "category": "img1",
              "flexSize": 1,
              "backgroundColor": "#bada55",
              "borderColor": "#89a725"
            },
            {
              "title": "square2",
              "category": "img2",
              "flexSize": 2,
              "backgroundColor": "#6699ff",
              "borderColor": "#1a66ff"
            }
          ]
        }
      ]
    })
  }

  allUsers() {
    return this.state.users.map((row, i) => {
      return(
        <UserRow key={i} data={row.row}/>
      )
    })
  }

  render() {
    return(
      <ScrollView style={{flex: 1}}>
        <ThemeCard />
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
