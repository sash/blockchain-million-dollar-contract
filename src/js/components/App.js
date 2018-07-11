import React from "react";
import {HashRouter as Router, Route, Link} from "react-router-dom";
import Grid from "./Grid.js";
import Publish from './Publish';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {balance: 0}
        // let {provider, account} = props;
        this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
    }

    componentDidUpdate(prevProps){
        if (prevProps.account !== this.props.account){
            this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
        }
    }

    render(){
        return <Router>
            <div>
                {!this.props.ethBrowser &&
                <div className="callout alert">
                    <h5>This browser is not ethereum enabled!</h5>
                    <p>Please use Google Chrome + MetaMask, Mist or Parity</p>
                </div>}
                {this.props.account &&
                <div>{this.props.account &&
                    <span>
                <span className="label primary">{this.props.account}</span>&nbsp;
                <span className="label secondary">{this.state.balance} tETH</span>
                    </span>
                }</div>}
                {!this.props.account && this.props.ethBrowser &&
                <div className="callout warning">
                    <h5>Your account is locked!</h5>
                    <p>Please unlock your account in order to use the app</p>
                </div>
                }


                <hr/>

                <Route exact path="/" render={routeProps => <Home {...routeProps} contract={this.props.contract} account={this.props.account}/>}/>
                <Route path="/publish/:x/:y/:length/:height"
                       render={routeProps =>
                           <Publish {...routeProps}
                                 contract={this.props.contract}
                                 account={this.props.account}
                           />}/>
                <Route path="/topics" component={Topics}/>
            </div>
        </Router>

    }
}

const Home = ({contract, account}) => (
    <div>
        <p>Buy your blocks of the blockchain history! Available blocks are highlighted in green! Your purchased blocks are ping and you can publish content to them</p>
        <div style={{display: 'flex', justifyContent:'center'}}>
        <Grid size={100} contract={contract} account={account}/>
        </div>

    </div>
);


const Topics = ({match}) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route
            exact
            path={match.url}
            render={() => <h3>Please select a topic.</h3>}
        />
    </div>
);

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

export default App;