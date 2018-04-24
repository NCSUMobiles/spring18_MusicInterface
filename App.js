import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';
import UserRow from './components/UserRow';
import ThemeCard from './components/ThemeCard'
import data from './data.json'
//import { NetworkInfo } from 'react-native-network-info';

var WebSocket = require('WebSocket')

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 0,
      users: data.blobs,
      theme: data.theme,
      preferredIndex: -1,
      preferredColor: -1
    }
    // allow children to use this function by naming in constructor
    this.updateChildTheme = this.updateChildTheme.bind(this);
    this.updateBlobColor = this.updateBlobColor.bind(this);

    // need to use the IPv4 address from ipconfig
    this.ws = new WebSocket('ws://10.152.28.122:8050/update');

    this.ws.onopen = () => {
      // connection opened
      console.log('On open: connected');
      this.ws.send('random crap'); // send a message
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log('On message: ' + e.data);
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log("On error: " + e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log("On close: " + e.code, e.reason);
    };
  }

  componentWillMount() {
    StatusBar.setHidden(true);
  }

  // very famous array sorting algorithm
  fisher_yates_shuffle(array){
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // Updates the themes when clicking a wheel
  updateChildTheme(choice) {
    //console.log('changed pie')
    this.setState({selected: choice});
    this.ws.send(this.state.theme[choice].sendCode);
  }

  updateBlobColor(index, color) {
    this.setState({preferredIndex: index, preferredColor: color});
  }

  allUsers() {
    // shuffle an array to help with assigning random colors in beginning
    arr = this.fisher_yates_shuffle([0,1,2,3,4,5,6,7]);

    if (this.state.preferredIndex != -1) {
      var otherIndex = arr.indexOf(this.state.preferredColor);
      if (otherIndex != -1) {
        arr[otherIndex] = arr[this.state.preferredIndex];
      }
      arr[this.state.preferredIndex] = this.state.preferredColor;
    }

    //How far youve gotten in array, used for assigning random colors
    arrIndex = 0;
    return this.state.users.map((row, i) => {
      // number of ppl in row
      len = row.row.length;
      // slice the array to obtain only numbers for this row
      choices = arr.slice(arrIndex, arrIndex + len);
      // make color pattern for UserRow
      colors = [];
      choices.map((c) => {
        colors.push(this.state.theme[this.state.selected].blobColors[c])
      })
      // increment arr index
      arrIndex += len;
      return(
        <UserRow
          key={i}
          data={row.row}
          colors={colors}
          blobColors={this.state.theme[this.state.selected].blobColors}
          updateBlobColor={this.updateBlobColor} />
      )
    })
  }

  /**
    * Renders a ThemeCard followed by a dynamic amount of
    * users. The ThemeCard component needs the list of themes
    * in order to display the color for the ThemePies. It also
    * needed the selected var in the state to keep track of
    * which Theme is currently selected. Lastly it needs a
    * reference to the updateChildThemes method in order to
    * ensure state is maintained and the User cards reflect
    * the chosen theme.
    */
  render() {
    return(
      <ScrollView style={{flex: 1}}>
        <ThemeCard
          themes={this.state.theme}
          selected={this.state.selected}
          updateTheme={this.updateChildTheme} />
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
