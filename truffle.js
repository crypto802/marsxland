require('babel-register');
require('babel-polyfill');

'use strict';

var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider('XXXXX', "https://mainnet.infura.io/v3/XXXXXXX")
      },
      gas: 2470000,
      gasPrice: "166000000000",
      confirmations: 2,
      timeoutBlocks: 100,
      skipDryRun: true,
      network_id: 1
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  api_keys: {
   etherscan: 'XXXXX'
  },
  plugins: [
   'truffle-plugin-verify'
 ]
}
