import React from "react";
import {HashRouter as Router, Route, Link} from "react-router-dom";
import Grid from "./Grid.js";
import Publish from './Publish';
import {utils} from 'ethers';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {balance: 0, boxPrice: false}
        // let {provider, account} = props;
        this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
        this.props.contract.boxPrice().then(boxPrice => (this.setState({boxPrice: boxPrice})));
    }

    componentDidUpdate(prevProps){
        if (prevProps.account !== this.props.account){
            this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
        }
    }

    render(){
        return <Router>
            <div>
                {!this.props.provider.isEthersEnabledBrowser() &&
                <div className="callout alert">
                    <h5>This browser is not ethereum enabled!</h5>
                    <p>Please use Google Chrome + MetaMask, Mist or Parity</p>
                </div>}
                {this.props.account &&
                <div>{this.props.account &&
                    <span>
                <span className="">Your account:</span>&nbsp;
                <span className="label primary">{this.props.account}</span>&nbsp;
                <span className="label secondary">{this.state.balance} ETH</span>
                    </span>
                }</div>}
                {!this.props.account && this.props.provider.isEthersEnabledBrowser() &&
                <div className="callout warning">
                    <h5>Your account is locked!</h5>
                    <p>Please unlock your account in order to use the app</p>
                </div>
                }


                <hr/>
                <Route path="/publish/:x/:y/:length/:height"
                       render={routeProps =>
                           <Publish {...routeProps}
                                    contract={this.props.contract}
                                    account={this.props.account}
                           />}/>
                <Home contract={this.props.contract} account={this.props.account}
                      provider={this.props.provider} boxPrice={this.state.boxPrice}/>

            </div>
        </Router>

    }
}

const Home = ({contract, account, provider, boxPrice}) => (
    <div>
        <p>Buy your blocks of the blockchain history! Greens are still available! Hurry up!</p>

        <p>Box price is <span className="label alert">{boxPrice && utils.formatEther(boxPrice)} ETH</span></p>

        <div style={{display: 'flex', justifyContent:'center'}}>
        <Grid size={100} contract={contract} account={account} provider={provider}/>

        </div>
        <div>
            Legend:<br/>
            <ul className="legend">
                <li><span className="free"></span> - The box is up for sale!</li>
                <li><span className="bought"></span> - The box is sold!</li>
                <li><span className="owned"> </span> - The box is sold and you are the owner! Congrats!</li>
                <li><span className="selected"> </span> - The box is selected. Choose another one to form a block!
                </li>
            </ul>
        </div>
    </div>
);



export default App;