import React, { Component } from 'react';
import { ProgressBar, Button, Card, Modal, Spinner, Nav} from 'react-bootstrap';
import Web3 from 'web3';
import MarsLand from '../abis/MarsLand0.json'


import Identicon from 'identicon.js';

class Landing extends Component {
 state = { show: false , loading: true, detected: true, alreadyClaimed: false, mintAmount: '1'};

 async loadData() {
   await this.loadWeb3()
   await this.loadBlockchainData()
 }

 openDialog() {
   this.loadData()
   this.setShow(true)
 }

 async loadWeb3() {
   if (window.ethereum) {
     window.web3 = new Web3(window.ethereum)
     await window.ethereum.enable()
   }
   else if (window.web3) {
     window.web3 = new Web3(window.web3.currentProvider)
   }
   else {
     this.setState((state) => {
       // Important: read `state` instead of `this.state` when updating.
       return {detected: false}
     });
   }
 }

 async loadBlockchainData() {
   const web3 = window.web3
   if(web3) {
     // Load account
     const accounts = await web3.eth.getAccounts()
     this.setState({ account: accounts[0] })
     // Network ID
     const networkId = await web3.eth.net.getId()
     const networkData = MarsLand.networks[networkId]
     if(networkData) {
       const marsLand = new web3.eth.Contract(MarsLand.abi, networkData.address)
       this.setState({ alreadyClaimed: await marsLand.methods.hasClaimed(accounts[0]).call()})
       const ma = await marsLand.methods.getCurrentMintAmount().call();
       this.setState({ mintAmount: ma.toString()})
       this.setState({ marsLand })
     } else {
       window.alert('MarsLand contract not deployed to detected network.')
     }
   }
   this.setState({ loading: false})
 }

  setShow(value) {
    this.setState((state) => {
      // Important: read `state` instead of `this.state` when updating.
      return {show: value}
    });
  }

  async mint() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const acccount = this.state.account
    if(accounts[0] == this.state.account) {
      this.state.marsLand.methods.claim().send({ from: this.state.account }).on('transactionHash', (hash) => {
          this.setShow(false);
      })
    } else {
      this.setState({ alreadyClaimed: await this.state.marsLand.methods.hasClaimed(accounts[0]).call()})
      this.setState((state) => {
        // Important: read `state` instead of `this.state` when updating.
        return {account: accounts[0]}
      });
      window.alert('Account has been change from ' + acccount +' \n to \n ' + accounts[0])
    }

  }

  render() {
    return (
      <div className="container-fluid mt-5">
       <div id="intro" className="view">

       <div className="mask rgba-black-strong">
           <div className="container-fluid d-flex align-items-center justify-content-center h-100">
               <div className="row d-flex justify-content-center text-center">
                   <div className="col-md-20">
                       <h3 className="display-4 font-weight-bold text-white pt-5 mb-2">Ethereum token for land ownership in Mars</h3>
                       <h3 className="display-4 font-weight-bold text-white pt-5 mb-2">MARSX Tokens</h3>
                       <hr className="hr-light"/>

                       <h4 className="text-white mb-2">Tokens are not for sale. Free to claim: First come, first served.</h4>
                       <h4 className="text-white my-4">50% of the mars area is tokenized. 50% is reserved for public use (not tokenized).</h4>
                       <h4 className="text-white my-4">Each token represents 1 km² of mars area (Max supply: 72399250 tokens).</h4>
                       <h4 className="text-white my-4">Each individual account address is eligable to claim only once.</h4>
                       <h4 className="text-white my-4">Number of tokens that each account can claim reduces over time.</h4>
                       <h4 className="text-white my-4">Dev team claimed 2% of the tokens on contract creation (possible only once) to cover DEV costs.</h4>
                       <h4 className="text-white my-4 ">The smart contract has no owner. No admin can mint extra tokens.</h4>
                       <Button variant="primary" onClick={() => this.openDialog()}>
                        Claim Tokens
                       </Button>
                       <Modal show={this.state.show} onHide={() => this.setShow(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title>Connect to a wallet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div>
                          { this.state.loading
                            ? <Spinner animation="border" />
                            :
                            <div>
                            {
                              this.state.detected
                              ?
                                <div>
                                  {
                                    this.state.alreadyClaimed
                                    ?
                                      <div>
                                        <p className="text-warning">Each account is eligible to claim only once. The following account has already claimed MARSLAND tokens:</p>
                                        <p className="text-warning">{this.state.account} </p>
                                      </div>
                                    :
                                      <div>
                                        The following account is eligible to mint {this.state.mintAmount} tokens for free (Ethereum gas fees has to be paied).
                                        <p className="text-primary">{this.state.account} </p>
                                      </div>
                                  }
                                </div>
                              :
                              <div>
                                <p className="text-warning"> Non-Ethereum browser detected. You should consider trying <Nav.Link href="https://metamask.io/">Metamask</Nav.Link> </p>
                              </div>
                            }
                            </div>
                          }
                        </div>

                        </Modal.Body>
                        <Modal.Footer>
                        {
                          this.state.alreadyClaimed || !this.state.detected
                          ?
                            <Button variant="primary" onClick={() => this.setShow(false)}>
                              Close
                            </Button>
                          :
                            <Button variant="primary" onClick={() => this.mint()}>
                              Mint
                            </Button>
                        }

                        </Modal.Footer>
                       </Modal>
                       <div className="spacer5"></div>
                       <div className="spacer5"></div>
                       <div className="spacer5"></div>

                       <h4 className="text-white my-4">Total Minted:</h4>
                      <ProgressBar animated now={2} label={'2%'}/>

                   </div>

               </div>

           </div>

       </div>

   </div>
  </div>
    );
  }
}

export default Landing;
