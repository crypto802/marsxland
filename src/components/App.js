import MarsLand from '../abis/MarsLand.json'
import React, { Component } from 'react';
import Identicon from 'identicon.js';
import Landing from './Landing'
import Web3 from 'web3';
import './App.css';


class App extends Component {


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      marsLand: null,
      loading: true
    }
  }

  render() {
    return (
      <div>
      <Landing
        openWallet= {this.openWallet}
         />
      </div>
    );
  }
}

export default App;
