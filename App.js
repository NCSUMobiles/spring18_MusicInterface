import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import GridLayout from './components/GridLayout';

export default class App extends React.Component {constructor() {
  super();
    this.state = {
      rows: []
    }
  }

  componentWillMount() {
    this.setState({
      "rows": [
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
        }
      ]
    })
  }

  allRows() {
    return this.state.rows.map((row, i) => {
      return(
        <GridLayout key={i} data={row.row}/>
      )
    })
  }

  render() {
    return(
      <View style={styles.container}>
        {this.allRows()}
      </View>
    )
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
