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
      data: [],
      preferredIndex: -1,
      preferredColor: -1
    }
    // allow children to use this function by naming in constructor
    this.updateChildTheme = this.updateChildTheme.bind(this);
    this.updateBlobColor = this.updateBlobColor.bind(this);

    // need to use the IPv4 address from ipconfig
    this.ws = new WebSocket('ws://10.137.128.110:8050/update');

    this.ws.onopen = () => {
      // connection opened
      console.log('On open: connected');
      this.ws.send(JSON.stringify({
        "type": "init"
      })); // send init instigating message
    };

    this.ws.onmessage = (e) => {
      // a message was received
      response = JSON.parse(e.data);
      switch(response.type) {
        case "init":          // receive msg with init data
          // set data to the response.data sorted by index
          this.setState({"selected": response.selected});
          this.setState({"data": response.data.sort(this.compare)});
          console.log("state data: ", this.state.data);
          break;
        default:
          console.log("recieved invalid message from processing");
      }
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

  // Sorting algorithm
  compare(a,b) {
    if (a.index < b.index)
      return -1;
    if (a.index > b.index)
      return 1;
    return 0;
  }

  // Updates the themes when clicking a wheel
  updateChildTheme(choice) {
    //console.log('changed pie')
    this.setState({selected: choice});
    this.ws.send(JSON.stringify({
      "type": "theme",
      "data": this.state.theme[choice].sendCode
    }));
  }

  updateBlobColor(index, color) {
    console.log("chosen color" + color);
    this.setState({preferredIndex: index, preferredColor: color});
    /**
      * sending the colors to processing
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify({
        "type": "blob",
        "data": arr
      }));
    } else {
      console.log("not connected");
    }
    */
  }

  allUsers() {
    /**
     * changing your color
    if (this.state.preferredIndex != -1) {
      var otherIndex = arr.indexOf(this.state.preferredColor);
      if (otherIndex != -1) {
        arr[otherIndex] = arr[this.state.preferredIndex];
      }
      arr[this.state.preferredIndex] = this.state.preferredColor;
    }
    */

    len = this.state.data.length;
    rowData = []
    colors = [];
    return this.state.data.map((data, i) => {
      rowData.push(data)
      colors.push(this.state.theme[this.state.selected].blobColors[data.colorId])

      if ((i != 0 && i%2 == 0) || i == len - 1) {
        console.log("i: " + i);
        console.log("row data: ", rowData);
        console.log("colors: ", colors);
        tempData = JSON.parse(JSON.stringify(rowData))
        tempColors = JSON.parse(JSON.stringify(colors))
        rowData = []
        colors = []
        return(
          <UserRow
            key={i}
            data={tempData}
            colors={tempColors}
            blobColors={this.state.theme[this.state.selected].blobColors}
            updateBlobColor={this.updateBlobColor} />
        )
      }
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
