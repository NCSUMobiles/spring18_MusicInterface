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
              "category": "img1"
            },
            {
              "title": "square2",
              "category": "img2"
            }
          ]
        },
        {
          "row": [
            {
              "title": "square3",
              "category": "img3"
            },
            {
              "title": "square4",
              "category": "img4"
            }
          ]
        },
        {
          "row": [
            {
              "title": "square5",
              "category": "img5"
            },
            {
              "title": "square6",
              "category": "img6"
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
